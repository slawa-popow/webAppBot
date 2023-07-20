import { Product, AllCategory } from "../types/Product";
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
    async getAllNotes(): Promise<Product[] | null> {
        const allNotes: Product[] | null = await this.client.getAllNotes();
        return (allNotes) ? allNotes : null;
    }


    async isRealUser(tableName: string): Promise<boolean> {
        return await this.client.isRealUser(tableName);
    }

    async getAllCategory(): Promise<AllCategory | null> {
        return await this.client.getAllCategory();
    }

}

export const db = new Db(mysqlClient);