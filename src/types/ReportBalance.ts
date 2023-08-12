
export interface Meta {
    href: string;
    metadataHref ?: string;
    type ?: string;
    mediaType: string;
    uuidHref ?: string;
    downloadHref ?: string;
    size ?: number;
    limit ?: number;
    offset ?: number;
};

export interface Uom {
    meta: Meta;
    name: string;
};

export interface Image {
    meta: Meta;
    title ?: string;
    filename ?: string;
    size ?: number;
    updated ?: string;
    miniature: Meta;
    tiny: Meta;
};

export interface ReportBalance {

    meta: Meta;             // Метаданные Товара/Модификации/Серии по которой выдается остаток

    stock : number;         // Остаток
    inTransit : number;     // Ожидание
    reserve : number;       // Резерв
    quantity : number;      // Доступно
    name : string;          // Наименование
    code : string;          // Код
    price ?: number;        // Себестоимость
    salePrice ?: number;    // Цена продажи
    externalCode : string;  // Внешний код сущности, по которой выводится остаток
    stockDays: number;      // Количество дней на складе

    uom: Uom;               // Единица измерения 
    image: Image;
};


export interface ReportStockQueryDB {
    stock : number;         // Остаток
    inTransit : number;     // Ожидание
    reserve : number;       // Резерв
    quantity : number;      // Доступно
    name : string;          // Наименование
    code : string;          // Код
    price ?: number;        // Себестоимость
    salePrice ?: number;    // Цена продажи
    externalCode : string;  // Внешний код сущности, по которой выводится остаток
    stockDays: number;      // Количество дней на складе
    image: string;          // Изображение товара

};

export interface ResponseReportStock {
    context: {
        employee: {
            meta: Meta;
        }
    };

    meta: Meta;
    rows: ReportBalance[];
}