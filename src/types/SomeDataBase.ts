
import { AllCategory } from './Product';


export interface SomeDataBase {
    
    getTenNotes<T>(): Promise<T[] | null>;
    isRealUser(tableName: string): Promise<boolean>;
    getAllCategory(): Promise<AllCategory | null>;

    
}