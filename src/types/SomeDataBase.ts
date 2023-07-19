
import { Product } from './Product';


export interface SomeDataBase {
    // getNoteById(id: string): Promise<Blog | null>;
    getAllNotes<T extends Product>(): Promise<T[] | null>;
    isRealUser(tableName: string): Promise<boolean>;
    // createNote<T extends Blog>(note: T): Promise<T | null>;
    // putNote<T extends Blog>(id: string, note: T): Promise<T | null>;
    // deleteNote<T>(id: string, note: T): void;
    // deleteAllNotes(): void;
}