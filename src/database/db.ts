import { FrontInputData } from "../types/FrontInputData";
import { AllCategory, ErrorInsertInto, Product } from "../types/Product";
import { ReqAddToBasket } from "../types/ReqAddToBasket";
import { SomeDataBase } from "../types/SomeDataBase";
import { mysqlClient } from "./MysqlClient";

/**
 * Внизу где export внедрение mysql клиента в конструктор класса Db
 */

/**
 * База данных
 */
class Db {

    constructor(public client: SomeDataBase) {}

    /** 
     * @returns Все записи из базы
     */
    async getTenNotes<T>(): Promise<T[] | null> {
        const allNotes = await this.client.getTenNotes<T>();
        return (allNotes && Array.isArray(allNotes)) ? allNotes : null;
    }

    // добавить в корзину
    async addToBasket(addProd: ReqAddToBasket): Promise<Product[] | ErrorInsertInto> {
        const result = await this.client.addToBasket(addProd);
       
        return result;
    }

    async getCalculatePrice(usid: string): Promise<Product[]> {
        return await this.client.recalcPrice(usid);
    }

    // Убрать из корзины
    async removeFromBasket(removeProd: ReqAddToBasket): Promise<Product[] | ErrorInsertInto> {
        const result = await this.client.removeFromBasket(removeProd);
        
        return result;
    }

    // вернуть корзину 
    async getBasketInfo(usid: string): Promise<Product[]> {
        const result = await this.client.getBasketInfo(usid);
        return result;
    }

    // проверка юзера
    async isRealUser(tableName: string): Promise<boolean> {
        return await this.client.isRealUser(tableName);
    }

    // вернуть все категории
    async getAllCategory(): Promise<AllCategory | null> {
        const cats = await this.client.getAllCategory();
       
        return cats;
    }

    // поиск по характеристикам
    async findByCharacts(data: FrontInputData): Promise<Product[]> {
        const result = await this.client.findByCharacts(data);
        return result;
    }

    // выбрать uuid, primary_id
    async getUuids(): Promise<Product[]> {
        const result = await this.client.getUuids();
        return result;
    }

    async setImageCount(X: string[][]): Promise<boolean> {
        const res = await this.client.setImageCount(X);
        return res;
    }

}

export const db = new Db(mysqlClient);