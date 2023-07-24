
export interface ErrorInsertInto {
    error: string[];
}


export interface Product {
    id: string | number;
    uuid: string;
    variantsCount?: number;
    группы: string;
    код: string;
    бренд: string;
    наименование: string;
    внешний_код: string;
    цена_от_1_до_2: string | number;
    цена_от_3_до_4: string | number;
    цена_от_5_до_9: string | number;
    цена_от_10_до_29: string | number;
    цена_от_30_до_69: string | number;
    цена_от_70_до_149: string | number;
    цена_от_150: string | number;
    штрихкод_EAN13: string | number;
    uuid_товара_модификации: string;
    код_товара_модификации: string;
    характеристики: string;
    цвет_характиристика: string;
    фото: string;
    
}

export interface Order {
    id: string | number;
    user_id: string;
    user_name: string;
    uniq_token?: string;
    name: string;
    datetime: string;
    category: string;
    data_type: string;
    brand: string;
    name_good: string;
    characteristic: string;
    count_on_stock: string | number;
    count_on_order: string | number;
    price_from_1to2: string | number;
    price_from_3to4: string | number;
    price_from_5to9: string | number;
    price_from_10to29: string | number;
    price_from_30to69: string | number;
    price_from_70to149: string | number;
    price_from_150: string | number;
    sum_position: string | number;
    delivery_method: string;
    price_delivery: string | number;
    address_delivery: string;
    time_delivery: string;
    pay_method: string;
    pay_status: string;
    order_status: string;
}


export interface AllCategory {
    categories: string[]
}

