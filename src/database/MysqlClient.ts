
import { SomeDataBase } from "../types/SomeDataBase";
import mysql from 'mysql';
import { Pool, PoolConnection } from "mysql";
import dotenv from 'dotenv';
import { AllCategory } from '../types/Product';
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
            const result =  await promCon(`SELECT DISTINCT SUBSTRING_INDEX(группы, "/", 1) 
                                          FROM ${this.table.allprods};`) as Record<string, string>[];
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



    async getTenNotes<T>(): Promise<T[] | null> {
        try {
            const connect = await this.getConnectionPool();
            const promCon = promisify(connect.query).bind(connect);

            const result =  await promCon(`
                SELECT * FROM ${this.table.allprods},
                (SELECT ROUND((SELECT MAX(${this.table.allprods}.id) FROM ${this.table.allprods}) * rand()) as rnd 
                FROM ${this.table.allprods} LIMIT 25) tmp
                WHERE ${this.table.allprods}.id in (rnd)
                ORDER BY id;
            `) as T[];

            connect.commit();
            connect.release();

            return result;

        } catch (e) { console.log('Error in MysqlClient->getAllNotes()->catch') }
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
 */