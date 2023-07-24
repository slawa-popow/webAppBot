
import { AllCategory, ErrorInsertInto, Product } from './Product';
import { ReqAddToBasket } from './ReqAddToBasket';


export interface SomeDataBase {
    
    getTenNotes<T>(): Promise<T[] | null>;
    isRealUser(tableName: string): Promise<boolean>;
    getAllCategory(): Promise<AllCategory | null>;
    addToBasket(addProd: ReqAddToBasket): Promise<Product[] | ErrorInsertInto>;
    
}