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
            response.status(400).json( { errorsMessages: errors.array({onlyFirstError: true}) } ); 
        } 
        const id = request.params.id;
        request.session!.id = id; 
        response.status(200).render('index1', {layout: 'main1'}); 
    }


    async getAssort(request: Request, response: Response) {
        const id = request.session!.id;
        let debg;
        if (id) {
            const validUser = await db.isRealUser(id);
            debg = validUser;
            if (validUser) {
                const products = await db.getAllNotes();
                const result = (products && products.some((v) => Object.keys(v).length > 0)) ? products: [];
                const responseAll: ResultAllProds = {paramId: id, allProducts: result};
                response.status(200).json(responseAll);
            }
        }
        response.status(400).send(`Ресурс временно не доступен. ${debg}`); 
    }
}


export const mainController = new MainController();