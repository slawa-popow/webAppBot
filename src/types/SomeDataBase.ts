
import { Product, AllCategory } from './Product';


export interface SomeDataBase {
    
    getAllNotes<T extends Product>(): Promise<T[] | null>;
    isRealUser(tableName: string): Promise<boolean>;
    getAllCategory(): Promise<AllCategory | null>;

    
}