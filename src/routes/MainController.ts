import { Request, Response } from 'express';
// import dotenv from 'dotenv';
import { db } from '../database/db';
import { Product } from '../types/Product';
import { myValidationResult } from '../customErrors/customErrField';
import { getImgSrcFromMySklad } from '../utils/getImgSrcFromMySklad';
import { ResultFromMySklad } from '../types/ResultFromMySklad';
import { ReqAddToBasket } from '../types/ReqAddToBasket';

interface ResultAllProds {
    paramId: string | number;
    allProducts: Product[];
}


class MainController {

    async getIndexPage(request: Request, response: Response) {
        const errors = myValidationResult(request);
         
        if (!errors.isEmpty()) {
            return response.status(400).json( { errorsMessages: errors.array({onlyFirstError: true}) } ); 
        } 
        const id = request.params.id;
        request.session!.id = id; 
        return response.status(200).render('indexB', {layout: 'mainB'});  
    }


    async getUserId(request: Request, response: Response) {
        const id: string = request.session!.id;
        if (id) {
            return response.status(200).json({usid: id});
        }
        return response.status(400).send('Страница временно не доступна.')
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
        return response.status(404).json({error: "<-- Error request -->"}); 
    }


    async getTenProd(request: Request, response: Response) {
        const id = request.session!.id;
        
        if (id) {
            const validUser = await db.isRealUser(id);
             
            if (validUser) {
                const products = await db.getTenNotes<Product>();
                

                const result = (products && products.some((v) => Object.keys(v).length > 0)) ? products: [];
                if (result.length > 0) {
                    for (let p of result) {
                        const fromMySklad: ResultFromMySklad = await getImgSrcFromMySklad(p.uuid);
                        p['фото'] = fromMySklad.img;
                        p.variantsCount = fromMySklad.variantsCount;
                    }
                }
                const responseAll: ResultAllProds = {paramId: id, allProducts: result};
                return response.status(200).json(responseAll);
            }
        }
        return response.status(400).send(`Ресурс временно не доступен. ${request.session!.id}`); 
    }
}


export const mainController = new MainController();