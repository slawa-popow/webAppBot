
import { SomeDataBase } from "../types/SomeDataBase";
import mysql from 'mysql';
import { Pool, PoolConnection } from "mysql";
import dotenv from 'dotenv';
import { AllCategory, ErrorInsertInto, Order, Product } from '../types/Product';
import { promisify } from 'util';
import { ReqAddToBasket } from "../types/ReqAddToBasket";
import { OkPacket } from "../types/OkPacket";
import { StatusOrder } from "../types/StatusOrder";
import { CatsHaracters } from "../types/CatsHaracters";
import { FrontInputData } from "../types/FrontInputData";
// import { OkPacket } from '../types/OkPacket'

interface Tables {
    products: string;
    allprods: string;
};

dotenv.config();

class MysqlClient implements SomeDataBase {

    private HOST: string = process.env.HOST || '';
    private USER: string = process.env.USER || '';
    private DATABASE: string = process.env.DATABASE || '';
    private PASSWORD: string = process.env.PASSWORD || '';
    private protected: Pool | null = null;
    table: Tables = {products: 'products_1', allprods: 'Товары'};

    constructor() {
        this.initPool();
    }

    private initPool(): void {
        this.protected =  mysql.createPool({
            connectionLimit: 1000, 
            host: this.HOST,
            user: this.USER,
            password: this.PASSWORD,
            database: this.DATABASE
        }); 
    }

    /**
     * 
     * @returns Соединение для экзекуций
     */
    async getConnectionPool(): Promise<PoolConnection> {
        const promiseDbCb = promisify(this.protected!.getConnection).bind(this.protected); 
        return await promiseDbCb(); 
    }

    async isRealUser(tableName: string): Promise<boolean> {
        let isOk: boolean = false;
        let result: string[] | unknown | null = null;
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        try {
            result = await promCon(`SHOW TABLES FROM ${this.DATABASE};`);

        } catch (e) { 
            console.log('Error in MysqlClient->getAllNotes()->catch') 
            return false;
        }
        finally {
            
            connect.release();
        }
        if (result && Array.isArray(result)) {
            isOk = result.some(v => {
                const table = Object.values(v);  
                return table[0] === tableName;
            });
        }
        return isOk;
    }


    /**
    * should input data
    * {
        category: 'Снюс',
        characteristics: [ 'крепкие 50мг(hard)', 'сладкие' ],
        brands: [],
        searchText: 'Apolo blue'
       }
    */
    async findByCharacts(data: FrontInputData): Promise<Product[]> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        let query: string = ''; 
        
        
        if (data.brands.length > 0 && data.searchText.trim().length === 0) {
            query = data.brands.map((v: string) => {
                return `бренд LIKE "%${v}%"`
            }).join(' OR ');
            
        } else {
            query = data.searchText.split(' ').map((v) => {
                return `(характеристики LIKE "%${v}%") OR (наименование LIKE "%${v}%")`
            }).join(' OR ');
        }
        
        try {
            // console.log(query);
            const qfind = await promCon(`
            SELECT * FROM Товары WHERE (${query}) AND 
            Товары.группы = "${data.category}";
            `) as Product[];
            
            return qfind;

        } catch {
            console.log('Error in MysqlClient->findByCharacts()->catch');
        }
        finally {
            connect.release();
        }
        return [];
    }


    async getAllCategory(): Promise<AllCategory | null> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        let responseCats: CatsHaracters = {categories: [], characteristics: {}, brands: {}};
        try {
            const result =  await promCon(`SELECT DISTINCT SUBSTRING_INDEX(группы, "/", 1) 
                                          FROM ${this.table.allprods};`) as Record<string, string>[];

           
            let rows = result.map((v) => {
                const value = Object.values(v);
                if (value.length > 0) 
                    return value[0];
                return;
            })as string[];
            
           

            responseCats.categories.push(...rows); // вставим все категории
            // получить все уникальные характеристики по каждой категории
            for (let v of rows) {
                const brandsByCatego = await promCon(`
                    SELECT DISTINCT бренд
                    FROM Товары
                    WHERE группы LIKE "%${v}%";
                `) as {[key: string]: string}[];
                
                responseCats.brands[v] = [...brandsByCatego.map(val => {
                    return val['бренд'];
                })];      
            } 
              
            return responseCats;

        } catch {
            console.log('Error in MysqlClient->getAllCategory()->catch');
        }
        finally {
            connect.release();
        }
        return null;
    }


    async deleteProduct(userId: string, idProduct: string): Promise<Product[]> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        try {
            await promCon(`DELETE FROM ${userId} WHERE product_id=${idProduct};`) as Product[];
            const result = await this.getBasketInfo(userId);
            return result;

        } catch (e) { console.log('Error in MysqlClient->deleteProduct()->catch', e) }
        finally {
            connect.release();
        }
        return [];

    }


    /**
     * Вернуть корзину с данными клиента
     * @param usid id telegram user
     * @returns 
     */
    async getBasketInfo(usid: string): Promise<Product[]> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);

        try {
            const basket = await promCon(`SELECT * FROM ${usid};`) as Product[];
            return basket;

        } catch (e) { console.log('Error in MysqlClient->agetBasketInfo()->catch', e) }
        finally {
            connect.release();
        }
        return [];
    }

    /**
     * Перерасчет цены в зависимости от кол-ва товаров
     * @param p товар
     */
    async recalcPrice(userId: string): Promise<Product[]> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        try {
            await this.sumCountOrder(userId);
            await this.currentPrice(userId);
            const basket = await promCon(`SELECT * FROM ${userId};`) as Product[];
            return basket;
        } catch (e) { console.log('Error in MysqlClient->recalcPrice()->catch', e) }
        finally {
            connect.release();
        }
        return [];
    }

    /**
     * Добавить товар в корзину по айди
     * @param addProd данные об товаре из фронта 
     * @returns 
     */
    async addToBasket(userId: string, addProds: {[key: string]: number}): Promise<Product[] | ErrorInsertInto> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        try {
            
            for (let prd of Object.keys(addProds)) {
                const result = await promCon(`SELECT * FROM ${this.table.allprods} WHERE id=${prd};`) as Product[];
                
                if (Array.isArray(result) && result.length > 0) {
                    const p: Product = result[0];
                    const usid = userId.split('_')[1];
                                    
                    if ( p['количество_на_складе'] && +p['количество_на_складе'] > 0) {
                        let findProductWithId;
                        try {
                            findProductWithId  = await promCon(`
                                SELECT count_on_order FROM ${userId} WHERE product_id=${prd};
                            `) as Order[];
                        } catch (e) {} 
                        
                        if (Array.isArray(findProductWithId) && findProductWithId.length === 0) {
                            let cnt_on_order = 1;
                            if (p['количество_на_складе'] && +addProds[prd] <= +p['количество_на_складе']) {
                                cnt_on_order = addProds[prd];
                            }
                                await promCon(`
                                INSERT INTO ${userId} (user_id, product_id, photo, uniq_token, datetime, category, brand,
                                    name_good, characteristic, count_on_stock, count_on_order, price_from_1to2, price_from_3to4, price_from_5to9,
                                    price_from_10to29, price_from_30to69, price_from_70to149, price_from_150, order_status)
                                VALUES ("${usid}", "${prd}", "${p['фото']}", "", "${new Date().toISOString()}", "${p["группы"].replace(/"/g, '')}", "${p["бренд"].replace(/"/g, '')}", "${p["наименование"].replace(/"/g, '')}",
                                    "${p["характеристики"].replace(/"/g, '')}", "${p["количество_на_складе"] || 0}", "${cnt_on_order}",  "${p["цена_от_1_до_2"] || 0}", "${p["цена_от_3_до_4"] || 0}",
                                    ${p["цена_от_5_до_9"] || 0}, ${p["цена_от_10_до_29"] || 0}, ${p["цена_от_30_до_69"] || 0}, ${p["цена_от_70_до_149"] || 0},
                                    "${p["цена_от_150"] || 0}", "${StatusOrder.IN_BASKET}");
                                `) as OkPacket;
                        }
                        else {
                            if (Array.isArray(findProductWithId) && findProductWithId[0]) {
                                 
                                if (p['количество_на_складе'] && addProds[prd] <= +p['количество_на_складе']) {
                                    await promCon( `
                                        UPDATE ${userId} 
                                        SET count_on_order="${addProds[prd]}"
                                        WHERE ${userId}.product_id=${prd};
                                    `);
                                    
                                }

                            }
                    }
                    }
                    
                }
            }
            const basket = await this.recalcPrice(userId);
            return basket;

        } catch (e) { console.log('Error in MysqlClient->addToBasket()->catch', e) } 
        finally {
            connect.release();
        }
        
        return {error: ['err-корзина(+)']};
    }


    async sumCountOrder(tableName: string): Promise<void> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);

        try {
            await promCon(`
                    UPDATE ${tableName} a 
                    INNER JOIN (SELECT SUM(count_on_order) as total, category FROM ${tableName} GROUP BY category) b 
                    ON a.category=b.category
                    SET count_on_order_cats=b.total;
                `); 
                connect.commit();
                connect.release();
        } catch (e) { console.log('Error in MysqlClient->sumCountOrder()->catch', e) }
    }


    

    async currentPrice(tableName: string): Promise<void> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);

        try {
            await promCon(`
            UPDATE ${tableName} a
            INNER JOIN(
                SELECT id, category, 
                CASE
                    WHEN count_on_order_cats BETWEEN 1 AND 2 then price_from_1to2
                    WHEN count_on_order_cats BETWEEN 3 AND 4 then price_from_3to4
                    WHEN count_on_order_cats BETWEEN 5 AND 9 then price_from_5to9
                    WHEN count_on_order_cats BETWEEN 10 AND 29 then price_from_10to29
                    WHEN count_on_order_cats BETWEEN 30 AND 69 then price_from_30to69
                    WHEN count_on_order_cats BETWEEN 70 AND 149 then price_from_70to149
                    WHEN count_on_order_cats >= 150 then price_from_150
                end as summa
                FROM ${tableName} 
                GROUP BY id   
                ) d
            ON a.id=d.id
            SET a.current_price = d.summa;
            `);
            connect.commit();
            connect.release();
        } catch (e) { console.log('Error in MysqlClient->currentPrice()->catch', e) }
    }

    /**
     * Убрать товар из корзины по айди
     * @param addProd данные об товаре из фронта
     * @returns 
     */
    async removeFromBasket(removeProd: ReqAddToBasket): Promise<Product[] | ErrorInsertInto> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        try {
            const current_basket = await promCon(`SELECT * FROM ${removeProd.userId} WHERE product_id=${removeProd.idProduct};`) as Product[];
            if (current_basket && current_basket.length > 0) {
                const findProductWithId = await promCon(`
                    SELECT count_on_order FROM ${removeProd.userId} WHERE product_id=${removeProd.idProduct};
                `) as Order[];
                if (Array.isArray(findProductWithId) && findProductWithId.length > 0) {
                    const findCountOnOrder = +findProductWithId[0].count_on_order || null;
                    if (findCountOnOrder) {
                        if (findCountOnOrder === 1) {
                            await promCon(`DELETE FROM ${removeProd.userId} WHERE product_id=${removeProd.idProduct} LIMIT 1;`) as OkPacket;
                        } else {
                            if (findCountOnOrder > 1)
                                await promCon( `
                                        UPDATE ${removeProd.userId} 
                                        SET count_on_order="${findCountOnOrder - 1}"
                                        WHERE ${removeProd.userId}.product_id=${removeProd.idProduct};
                                        `);
                
                        }
                    }
                }
            }

        
            const basket = await promCon(`SELECT * FROM ${removeProd.userId};`) as Product[];
            return basket; 
        } catch (e) { console.log('Error in MysqlClient->removeFromBasket()->catch', e) } 
        finally {
            connect.release();
        }
        
        return {error: ['err-корзина(-)']};
    }


    async getUuids(): Promise<Product[]> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        try {
            const uuids = await promCon(`SELECT id, uuid FROM ${this.table.allprods};`) as Product[];
            return uuids;

        } catch (e) { console.log('Error in MysqlClient->getUuids()->catch', e) } 
        finally {
            connect.release();
        }
        return [];
    }

    async setImageCount(X: string[][]): Promise<boolean> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        try {
            for (let x of X) {
                await promCon(`
                UPDATE ${this.table.allprods} SET количество_на_складе=${x[2]}, фото="${x[1].replace(/'/g, '')}" WHERE ${this.table.allprods}.id=${x[0]}; 
                `);

            }
            return true;
        } catch (e) { console.log('Error in MysqlClient->setImageCount()->catch', e) }  
        finally {
            connect.release();
        }
        return false;
    }


    async getTenNotes<T>(): Promise<T[] | null> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        try {
            const result =  await promCon(`
                SELECT * FROM ${this.table.allprods},
                (SELECT ROUND((SELECT MAX(${this.table.allprods}.id) FROM ${this.table.allprods}) * rand()) as rnd 
                FROM ${this.table.allprods} LIMIT 10) tmp
                WHERE ${this.table.allprods}.id in (rnd)
                ORDER BY id;
            `) as T[];
            
            return result;
            
        } catch (e) { console.log('Error in MysqlClient->getAllNotes()->catch') }
        finally {
            connect.release();
        }
        return null;
    }


}

export const mysqlClient = new MysqlClient()





/**
 * const result =  await promCon(`SELECT DISTINCT группы FROM ${this.table.allprods};`) as Record<string, string>[];
 * 
 * const result =  await promCon(`SELECT DISTINCT SUBSTRING_INDEX(Группы, "/", 1) 
 *                                FROM ${this.table.allprods};`) as Record<string, string>[];
 * 
 * ---------- 10 unique ----------------
 SELECT * FROM `Товары`,
(SELECT ROUND((SELECT MAX(`Товары`.id) FROM `Товары`) *rand()) as rnd 
FROM `Товары` LIMIT 25) tmp
WHERE `Товары`.id in (rnd)
ORDER BY id


----------------------------------------
[
[debug]   RowDataPacket {
[debug]     id: 578,
[debug]     uuid: '6ff62b30-b813-11ed-0a80-0d20000ab7cd',
[debug]     'группы': 'Жидкости для вейпа/SMOKE KITCHEN',
[debug]     'код': '866',
[debug]     'бренд': 'SK 360',
[debug]     'наименование': 'жидкость "SK 360"',
[debug]     'внешний_код': 'VQQZwctBgHy6yoLZxtC401',
[debug]     'цена_от_1_до_2': 0,
[debug]     'цена_от_3_до_4': 0,
[debug]     'цена_от_5_до_9': 0,
[debug]     'цена_от_10_до_29': 9.5,
[debug]     'цена_от_30_до_69': 9,
[debug]     'цена_от_70_до_149': 8.5,
[debug]     'цена_от_150': 8,
[debug]     'штрихкод_EAN13': '2000000009582',
[debug]     'uuid_товара_модификации': '6ff62309-b813-11ed-0a80-0d20000ab7cb',
[debug]     'код_товара_модификации': '1339689783593',
[debug]     'характеристики': '///крепкие///////жидкости для вейпа/',
[debug]     'цвет_характиристика': '',
[debug]     'фото': ''
[debug]   }
[debug] ]
---------------------------------------------------------------------
UPDATE Товары, Лист1 SET Товары.цена_от_1_до_2=Лист1.цена_от_1_до_2, 
Товары.цена_от_3_до_4=Лист1.цена_от_3_до_4, 
Товары.цена_от_5_до_9=Лист1.цена_от_5_до_9, 
Товары.цена_от_10_до_29=Лист1.цена_от_10_до_29, 
Товары.цена_от_30_до_69=Лист1.цена_от_30_до_69, 
Товары.цена_от_70_до_149=Лист1.цена_от_70_до_149, 
Товары.цена_от_150 = Лист1.цена_от_150 
WHERE Товары.id=Лист1.id


cумма строк
SELECT SUM(count_on_order), category FROM User_1941650155 GROUP BY category


UPDATE User_1941650155 a INNER JOIN (SELECT  SUM(count_on_order) as total, category FROM User_1941650155 GROUP BY category) b 
ON a.category=b.category
SET count_on_order_cats=b.total


SELECT category, count_on_order_cats, 
CASE
	WHEN count_on_order_cats BETWEEN 1 AND 2 then price_from_1to2
    WHEN count_on_order_cats BETWEEN 3 AND 4 then price_from_3to4
    WHEN count_on_order_cats BETWEEN 5 AND 9 then price_from_5to9
    WHEN count_on_order_cats BETWEEN 10 AND 29 then price_from_10to29
    WHEN count_on_order_cats BETWEEN 30 AND 69 then price_from_30to69
    WHEN count_on_order_cats BETWEEN 70 AND 149 then price_from_70to149
    WHEN count_on_order_cats >= 150 then price_from_150
end as summa
FROM User_1941650155 
GROUP BY category
------------------------------------------------------------------------------


UPDATE User_1941650155 a INNER JOIN (SELECT  SUM(count_on_order) as total, category FROM User_1941650155 GROUP BY category) b 
ON a.category=b.category
SET a.count_on_order_cats=b.total;

UPDATE User_1941650155 c
INNER JOIN(
SELECT id, category, 
CASE
	WHEN count_on_order_cats BETWEEN 1 AND 2 then price_from_1to2
    WHEN count_on_order_cats BETWEEN 3 AND 4 then price_from_3to4
    WHEN count_on_order_cats BETWEEN 5 AND 9 then price_from_5to9
    WHEN count_on_order_cats BETWEEN 10 AND 29 then price_from_10to29
    WHEN count_on_order_cats BETWEEN 30 AND 69 then price_from_30to69
    WHEN count_on_order_cats BETWEEN 70 AND 149 then price_from_70to149
    WHEN count_on_order_cats >= 150 then price_from_150
end as summa
FROM User_1941650155 
GROUP BY id   
) d
ON c.id=d.id
SET c.current_price = d.summa
 */