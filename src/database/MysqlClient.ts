
import { SomeDataBase } from "../types/SomeDataBase";
import mysql from 'mysql';
import { Pool, PoolConnection } from "mysql";
import dotenv from 'dotenv';
import { Product, AllCategory } from '../types/Product';
import { promisify } from 'util';
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
            connectionLimit: 10,
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
        try {
            const connect = await this.getConnectionPool();
            const promCon = promisify(connect.query).bind(connect);
            result = await promCon(`SHOW TABLES FROM ${this.DATABASE};`);

        } catch (e) { 
            console.log('Error in MysqlClient->getAllNotes()->catch') 
            return false;
        }
        if (result && Array.isArray(result)) {
            isOk = result.some(v => {
                const table = Object.values(v);  
                return table[0] === tableName;
            });
        }
        return isOk;
    }

    async getAllCategory(): Promise<AllCategory | null> {
        try {
            const connect = await this.getConnectionPool();
            const promCon = promisify(connect.query).bind(connect);

            const result =  await promCon(`SELECT DISTINCT Группы FROM ${this.table.allprods};`) as Record<string, string>[];
            connect.commit();
            connect.release();
            let rows = result.map((v) => {
                const value = Object.values(v);
                if (value.length > 0) 
                    return value[0];
                return;
            }) as string[];

            return (rows.length > 0) ? {categories: [...rows]} : null;

        } catch {
            console.log('Error in MysqlClient->getAllCategory()->catch');
        }
        return null;
    }



    async getAllNotes<T extends Product>(): Promise<T[] | null> {
        try {
            const connect = await this.getConnectionPool();
            const promCon = promisify(connect.query).bind(connect);

            const result =  await promCon(`SELECT * FROM ${this.table.products};`) as T[];
            connect.commit();
            connect.release();

            return result;

        } catch (e) { console.log('Error in MysqlClient->getAllNotes()->catch') }
        return null;
    }


//     async getNoteById(id: string): Promise<Blog | null> {
//         try {
//             const connect = await this.getConnectionPool();
//             const promCon = promisify(connect.query).bind(connect);

//             const responseSelect: Blog =  await promCon(`
//                         SELECT * FROM samples WHERE id=${id};
//                 `) as Blog;
//             connect.commit();
//             connect.release();
//             return responseSelect;

//         } catch (e) { console.log('Error in MysqlClient->getNoteById()->catch') }
//         return null;
//     }


   
//   /**
//    * 
//    * @param note Запись блога
//    * @returns последняя запись в бд (добавленная)
//    */
//     async createNote<T extends Blog>(note: T): Promise<T | null> {
//         const connect = await this.getConnectionPool();
//         const promCon = promisify(connect.query).bind(connect);
//         try {
//             const responseIsnert = await promCon(`
//                 INSERT INTO samples (name, description, websiteUrl)
//                         VALUES ("${note.name || ''}", "${new Date().toISOString() || ''}", "${note.websiteUrl || ''}")
//             `) as OkPacket;
    
//             const responseSelect =  await promCon(`SELECT * FROM samples WHERE id=${responseIsnert.insertId};`) as T;
//             connect.commit();
//             connect.release(); // загнать подключение страдать обратно на завод

//             return responseSelect;

//         } catch (e) { console.log('Error in MysqlClient->createNote()->catch') }
//         return null;
//     }


//     /**
//      * Операция PUT по id
//      * @param id индетификатор записи которую надо заменить 
//      * @param note запись для замены
//      * @returns измененная запсь
//      */
//     async putNote<T extends Blog>(id: string, note: T): Promise<T | null> {
//         const connect = await this.getConnectionPool();
//         const promCon = promisify(connect.query).bind(connect);

//         try {
//             await promCon(`
//                 UPDATE samples SET name='${note.name}', description='${note.description}', websiteUrl='${note.websiteUrl}' WHERE id=${id}; 
//             `) as OkPacket;
            
//             const responseSelect =  await promCon(`SELECT * FROM samples WHERE id=${id};`) as T;
//             connect.commit();
//             connect.release();
            
//             return responseSelect;
//         } catch (e) { console.log('Error in MysqlClient->putNote()->catch') }
//         return null;
//     }


    // updateNote<T>(id: string, note: T): void;
    // deleteNote<T>(id: string, note: T): void;
    // deleteAllNotes(): void;
}

export const mysqlClient = new MysqlClient()