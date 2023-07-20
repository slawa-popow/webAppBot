
import { Product, AllCategory } from './Product';


export interface SomeDataBase {
    
    getAllNotes<T extends Product>(): Promise<T[] | null>;
    isRealUser(tableName: string): Promise<boolean>;
    getAllCategory(): Promise<AllCategory | null>;

    // createNote<T extends Blog>(note: T): Promise<T | null>;
    // putNote<T extends Blog>(id: string, note: T): Promise<T | null>;
    // deleteNote<T>(id: string, note: T): void;
    // deleteAllNotes(): void;
    // getNoteById(id: string): Promise<Blog | null>;
}