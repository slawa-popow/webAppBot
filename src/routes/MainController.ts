import { Request, Response } from 'express';
// import dotenv from 'dotenv';
import { db } from '../database/db';
import { Product } from '../types/Product';
import { getImgSrcFromMySklad } from '../utils/getImgSrcFromMySklad';
import { ResultFromMySklad } from '../types/ResultFromMySklad';
import { ReqAddToBasket } from '../types/ReqAddToBasket';
import { FrontInputData } from '../types/FrontInputData';
// import { CountAndImage } from '../types/CountAndImage';

interface ResultAllProds {
    paramId: string | number;
    allProducts: Product[];
}


class MainController {

    async getIndexPage(request: Request, response: Response) {
        const requery = request.query;
        
        const id = requery.usid;
        console.log('id getIndexPage: ', id);
        if (request.session)
            request.session.id = id; 
        return response.status(200).render('indexFFF', {layout: 'mainFFF'});   
    } 


    async getUserId(request: Request, response: Response) { 
        const id: string = request.session!.id;
        console.log('id sesion: ', id);
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


    async addToBasket(request: Request, response: Response) { 
        const addProd: ReqAddToBasket = request.body;
        if (addProd.userId && addProd.idProduct) {
            const result = await db.addToBasket(addProd); 
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


    async searchByCharacts(request: Request, response: Response) {
        const data: FrontInputData = request.body;
        const result = await db.findByCharacts(data);
        response.status(200).json(result)
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