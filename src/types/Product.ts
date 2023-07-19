
export interface Product {
    id: string | number;
    userId: string;
    photo: string;
    userName?: string;
    uniqToken?: string;
    name?: string;
    datetime?: string;
    category: string;
    dataType: string;
    brand: string;
    productId?: string;
    nameGood: string;
    nameTaste: string;
    characteristic: string;
    countOnStock: number;
    countOnOrder: number;
    priceFrom_1to2: number;
    priceFrom_3to4: number;
    priceFrom_5to9: number;
    priceFrom_10to29: number;
    priceFrom_30to69: number;
    priceFrom_70to149: number;
    priceFrom_150: number;
    sumPosition: number;
    deliveryMethod?: string;
    priceDelivery: number;
    addressDelivery?: string;
    timeDelivery?: string;
    payMethod?: string;
    payStatus?: string;
    orderStatus?: string;
}

