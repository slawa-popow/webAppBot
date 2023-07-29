
import { SomeDataBase } from "../types/SomeDataBase";
import mysql from 'mysql';
import { Pool, PoolConnection } from "mysql";
import dotenv from 'dotenv';
import { AllCategory, ErrorInsertInto, Order, Product } from '../types/Product';
import { promisify } from 'util';
import { ReqAddToBasket } from "../types/ReqAddToBasket";
import { OkPacket, RowDataPacketCharacteristic } from "../types/OkPacket";
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
            connectionLimit: 100,
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
        const promiseDbCb = promisify(this.protected!.getConnection).bind(this.protected); // выщемить поключение
        return await promiseDbCb(); // предать яви подключение
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
        searchText: 'Apolo blue'
       }
    */
    async findByCharacts(data: FrontInputData): Promise<Product[]> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
         
        const nameChars: string = data.characteristics.map((v: string) => {
            return `характеристики LIKE "%${v}%"`;
        }).join(' AND ');
        try {
            const qfind = await promCon(`
            SELECT * FROM Товары WHERE 
            ${nameChars}
            AND LCASE(группы)="${data.category}";
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
        let responseCats: CatsHaracters = {categories: [], characteristics: {}};
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
                
                const charactsQuery = await promCon(`
                SELECT DISTINCT LCASE(характеристики) AS characteristics FROM Товары WHERE LCASE(характеристики) LIKE "%${v}%"; 
                `) as RowDataPacketCharacteristic[];
                let setCharactsQuery = new Set();
                charactsQuery.forEach(v => {
                    if (v.characteristics) {
                        let chr = v.characteristics.split('/');
                        chr.forEach(el => {
                            if (el.trim().length > 0)
                                setCharactsQuery.add(el);
                        });
                    }
                });
            
                console.log('set ', setCharactsQuery);
            
                responseCats.characteristics[v] = Array.from(setCharactsQuery) as string[];
            } 
            console.log(responseCats);
            return responseCats;

        } catch {
            console.log('Error in MysqlClient->getAllCategory()->catch');
        }
        finally {
            connect.release();
        }
        return null;
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
     * Добавить товар в корзину по айди
     * @param addProd данные об товаре из фронта
     * @returns 
     */
    async addToBasket(addProd: ReqAddToBasket): Promise<Product[] | ErrorInsertInto> {
        const connect = await this.getConnectionPool();
        const promCon = promisify(connect.query).bind(connect);
        try {
            const result = await promCon(`SELECT * FROM ${this.table.allprods} WHERE id=${addProd.idProduct};`) as Product[];
            if (Array.isArray(result) && result.length > 0) {
                const p: Product = result[0];
                const usid = addProd.userId.split('_')[1];
                                
                if ( p['количество_на_складе'] && +p['количество_на_складе'] > 0) {
                    const findProductWithId = await promCon(`
                        SELECT count_on_order FROM ${addProd.userId} WHERE product_id=${addProd.idProduct};
                    `) as Order[];

                    if (Array.isArray(findProductWithId) && findProductWithId.length === 0) {
                            await promCon(`
                            INSERT INTO ${addProd.userId} (user_id, product_id, uniq_token, datetime, category, brand,
                                name_good, characteristic, count_on_stock, count_on_order, price_from_1to2, price_from_3to4, price_from_5to9,
                                price_from_10to29, price_from_30to69, price_from_70to149, price_from_150, order_status)
                            VALUES ("${usid}", "${addProd.idProduct}", "", "${new Date().toISOString()}", "${p["группы"].replace(/"/g, '')}", "${p["бренд"].replace(/"/g, '')}", "${p["наименование"].replace(/"/g, '')}",
                                "${p["характеристики"].replace(/"/g, '')}", "${p["количество_на_складе"] || 0}", "1",  "${p["цена_от_1_до_2"] || 0}", "${p["цена_от_3_до_4"] || 0}",
                                ${p["цена_от_5_до_9"] || 0}, ${p["цена_от_10_до_29"] || 0}, ${p["цена_от_30_до_69"] || 0}, ${p["цена_от_70_до_149"] || 0},
                                "${p["цена_от_150"] || 0}", "${StatusOrder.IN_BASKET}");
                            `) as OkPacket;
                    }
                    else {
                        const findCountOnOrder = +findProductWithId[0].count_on_order;
                        if (p['количество_на_складе'] && findCountOnOrder < +p['количество_на_складе']) {
                            await promCon( `
                                UPDATE ${addProd.userId} 
                                SET count_on_order="${findCountOnOrder + 1}"
                                WHERE ${addProd.userId}.product_id=${addProd.idProduct}
                            ` );
                        }
                }
                }

                const basket = await promCon(`SELECT * FROM ${addProd.userId};`) as Product[];
                return basket;
            }

        } catch (e) { console.log('Error in MysqlClient->addToBasket()->catch', e) } 
        finally {
            connect.release();
        }
        
        return {error: ['err-корзина(+)']};
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
                                        WHERE ${removeProd.userId}.product_id=${removeProd.idProduct}
                                    ` );
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
 */