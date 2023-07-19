import { Product } from "../types/Product";
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

    // async getNoteById(id: string): Promise<Blog | null> {
    //     return await this.client.getNoteById(id);
    // }


    // /**
    //  * @param note Запись для записи в бд
    //  * @returns Запись записанная в бд
    //  */
    // async createNote<T extends Blog> (note: T): Promise<T | null> {
    //     return await this.client.createNote(note);
    // }


    // /**
    //  * Операция PUT по id
    //  * @param id индетификатор записи которую надо заменить 
    //  * @param note запись для замены
    //  * @returns измененная запсь
    //  */
    // async putNoteById<T extends Blog>(id: string, note: T): Promise<T | null> {
    //     return await this.client.putNote(id, note);
    // }



}

export const db = new Db(mysqlClient);