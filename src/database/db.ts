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

    async addToBasket(addProd: ReqAddToBasket): Promise<Product[] | ErrorInsertInto> {
        const result = await this.client.addToBasket(addProd);
        return result;
    }


    async isRealUser(tableName: string): Promise<boolean> {
        return await this.client.isRealUser(tableName);
    }

    async getAllCategory(): Promise<AllCategory | null> {
        return await this.client.getAllCategory();
    }

}

export const db = new Db(mysqlClient);