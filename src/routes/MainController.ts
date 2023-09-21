import { Request, Response } from 'express';
// import dotenv from 'dotenv';
import { db } from '../database/db';
import { Product } from '../types/Product';
import { getImgSrcFromMySklad } from '../utils/getImgSrcFromMySklad';
import { ResultFromMySklad } from '../types/ResultFromMySklad';
import { ReqAddToBasket } from '../types/ReqAddToBasket';
import { FrontInputData } from '../types/FrontInputData';
import { getAllBalanceReport } from '../utils/getAllBalanceReport';
import { ReportBalance, ReportStockQueryDB } from '../types/ReportBalance';
// import { CountAndImage } from '../types/CountAndImage';

interface ResultAllProds {
    paramId: string | number;
    allProducts: Product[];
}


class MainController {

    async getBasketPage(request: Request, response: Response) {
        const requery = request.query;
        const id = requery.usid;
        if (request.session && request.session.id === id) {
            return response.status(200).render('basketIndex', {layout: 'basket'});
        }
        return response.status(400).json({error: "Корзина очищена", message: "Ваша корзина была очищена по таймеру. Пожалуйста, перейдите в телеграм и запустите бота."});
    }

    async getIndexPage(request: Request, response: Response) {
         
        if (request.session && request.session.id){ 
            return response.status(200).render('index_yyy', {layout: 'main_yyy'});    
        }
        return response.status(415).send('перезапусти бота') 
    } 


    async getUserId(request: Request, response: Response) { 
        const id: string = request.session!.id;
        
        if (id) {
            const basket: Product[] = await db.getBasketInfo(id);
            return response.status(200).json({usid: id, basket: [...basket]});
        }
        return response.status(400).json({error: "Корзина очищена", message: "Ваша корзина была очищена по таймеру. Пожалуйста, перейдите в телеграм и запустите бота."});
    }


    async getAllCategory(_request: Request, response: Response) {
        const allCategory = await db.getAllCategory();
        return response.status(200).json(allCategory);
    }
 
    async getCalculate(request: Request, response: Response) {
        const id = request.body.userId || null;
        if (id) {
            const res = await db.getCalculatePrice(id);
            return response.status(200).json(res);
        }
        return response.status(404).json({error: "calculate price: server error"});
    }


    // async addToBasket(request: Request, response: Response) { 
    //     const addProd: ReqAddToBasket = request.body;
    //     if (addProd.userId && addProd.idProduct) {
    //         const result = await db.addToBasket(addProd); 
    //         return response.status(200).json(result);
    //     }
    //     return response.status(404).json({error: "add product: server error"}); 
    // }


    async fillUserBasket(request: Request, response: Response) {
        const userData = request.body;
        
        if (userData && userData.userId && userData.idProducts) {
            const result = await db.addToBasket(userData.userId, userData.idProducts);
            
            return response.status(200).json(result);
        }
        return response.status(404).json({error: "add product: server error"});
    }


    async removeFromBasket(request: Request, response: Response) {
        const addProd: ReqAddToBasket = request.body;
        if (addProd.userId && addProd.idProduct) {
            const result = await db.removeFromBasket(addProd); 
            return response.status(200).json(result);
        }
        return response.status(404).json({error: "remove product: server error"});
    }

    async delProduct(request: Request, response: Response) {
          
        const prodInfo = request.body;
        if (prodInfo.userId && prodInfo.idProduct) {
            const result = await db.delProduct(prodInfo.userId, prodInfo.idProduct);
            return response.status(200).json(result);
        }
        return response.status(404).json({error: "delete product: server error"});
    }


    async searchByCharacts(request: Request, response: Response) {
        const data: FrontInputData = request.body;
        
        const result = await db.findByCharacts(data);
        response.status(200).json(result)
    }

    async getUsrBasket(request: Request, response: Response) {
        const id = request.body.userId;
        if (id) {
            const result = await db.getBasketInfo(id);
            
            return response.status(200).json(result);
        }
        return response.status(404).json({error: "getBasket: server error"});
    }


    async getTenProd(request: Request, response: Response) {
        const id = request.session!.id;
        
        if (id) {
            const validUser = await db.isRealUser(id);
             
            if (validUser) {
                const products = await db.getTenNotes<Product>();
                const result = (products && products.some((v) => Object.keys(v).length > 0)) ? products: [];
                
                const responseAll: ResultAllProds = {paramId: id, allProducts: result};
                return response.status(200).json(responseAll);
            }
        }
        return response.status(400).send(`Ресурс временно не доступен. ${request.session!.id}`); 
    }

    // ------------------------- ------------- ---------------- --------------------------------------

    async getAllOnStock(_request: Request, response: Response) {
        const result: ReportBalance[]  = await getAllBalanceReport();
        const arrSaveDb: ReportStockQueryDB[] = [];

        if (Array.isArray(result) && result.length > 0) {
            for (let data of result) {
                const report: ReportStockQueryDB = {
                    stock : 0,              // Остаток
                    inTransit: 0,           // Ожидание
                    reserve : 0,            // Резерв
                    quantity : 0,           // Доступно
                    name : '',              // Наименование
                    code : '',              // Код
                    price : 0,              // Себестоимость
                    salePrice : 0,          // Цена_продажи
                    externalCode : '',      // Внешний_код 
                    stockDays: 0,           // Дней_на_складе
                    image: ''               // Изображение_товара
                };

                report.stock = data.stock || 0;
                report.inTransit = data.inTransit || 0;
                report.reserve = data.reserve || 0;
                report.quantity = data.quantity || 0;
                report.name = data.name || '';
                report.code = data.code || '';
                report.price = (data.price) ? data.price : 0.0;
                report.salePrice = (data.salePrice) ? data.salePrice : 0.0;
                report.externalCode = data.externalCode || '';
                report.stockDays = data.stockDays || 0;
                report.image = (data.image && data.image.miniature && data.image.miniature.downloadHref) ?
                                data.image.miniature.downloadHref : ''; 

                arrSaveDb.push(report);
            }
        }
        
        const respDb = await db.writeReportBalance(arrSaveDb);
        if (respDb) {
            return response.status(200).send('<h1 style="color: green;">Сделано.</h1>');
        }
        return response.status(400).send('<h1 style="color: red;">Была ошибка.</h1>');
    }

    async fromMySklad(_request: Request, response: Response) {
        const uuids = await db.getUuids();
        const X = [];
        for (let i of uuids) {
            const fromMySklad: ResultFromMySklad = await getImgSrcFromMySklad(i.uuid);
            const img = fromMySklad.img;
            const count = fromMySklad.variantsCount;
            const res = [i.id, img, count] as string[];//{id: i.id, img: img, variantsCount: count}; 
            console.log(res);
            X.push(res);
        }
        const res = await db.setImageCount(X);

        return response.send(res);
    }
}

// id: 100,
// uuid: 'fb75b0f6-d180-11ed-0a80-0f0a00262ea9'

export const mainController = new MainController();