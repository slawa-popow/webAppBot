import { Request, Response } from 'express';
// import dotenv from 'dotenv';
import { db } from '../database/db';
import { Product } from '../types/Product';
import { myValidationResult } from '../customErrors/customErrField';

interface ResultAllProds {
    paramId: string | number;
    allProducts: Product[];
}


class MainController {

    getIndexPage(request: Request, response: Response) {
        const errors = myValidationResult(request);
         
        if (!errors.isEmpty()) {
            return response.status(400).json( { errorsMessages: errors.array({onlyFirstError: true}) } ); 
        } 
        const id = request.params.id;
        request.session!.id = id; 
        return response.status(200).render('index', {layout: 'main'});   
    }


    async getAssort(request: Request, response: Response) {
        const id = request.session!.id;
         
        if (id) {
            const validUser = await db.isRealUser(id);
             
            if (validUser) {
                const products = await db.getAllNotes();
                const result = (products && products.some((v) => Object.keys(v).length > 0)) ? products: [];
                const responseAll: ResultAllProds = {paramId: id, allProducts: result};
                return response.status(200).json(responseAll);
            }
        }
        return response.status(400).send(`Ресурс временно не доступен. ${request.session!.id}`); 
    }
}


export const mainController = new MainController();