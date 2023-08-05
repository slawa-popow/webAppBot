
import { FrontInputData } from './FrontInputData';
import { AllCategory, ErrorInsertInto, Product } from './Product';
import { ReqAddToBasket } from './ReqAddToBasket';


export interface SomeDataBase {
    
    getTenNotes<T>(): Promise<T[] | null>;
    isRealUser(tableName: string): Promise<boolean>;
    getAllCategory(): Promise<AllCategory | null>;
    addToBasket(addProd: ReqAddToBasket): Promise<Product[] | ErrorInsertInto>;
    removeFromBasket(removeProd: ReqAddToBasket): Promise<Product[] | ErrorInsertInto>;
    getBasketInfo(usid: string): Promise<Product[]>;
    findByCharacts(data: FrontInputData): Promise<Product[]>;

    recalcPrice(userId: string): Promise<Product[]>;
    sumCountOrder(tableName: string): Promise<void>;
    currentPrice(tableName: string): Promise<void>;

    getUuids(): Promise<Product[]>;
    setImageCount(X: string[][]): Promise<boolean>;
}