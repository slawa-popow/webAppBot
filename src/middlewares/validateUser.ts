
import { Request, Response, NextFunction } from "express";
import { db } from '../database/db';

export async function validateUser(request: Request, response: Response, next: NextFunction) { 
    const requery = request.query;
     
    if (requery && requery.usid) {
        const id = requery.usid as string;
        const validUser = await db.isRealUser(id);
        if (validUser) {
            return next();     
        }
    }
    return response.status(400).json({error: "Корзина очищена", message: "Скорее всего Ваша корзина была очищена по таймеру. Пожалуйста, перейдите в телеграм и запустите бота."});
}


export async function validUsr(request: Request, response: Response, next: NextFunction) {
    console.log('valid post session.id: ', request.session!.id) 
    if (request.session) {
        const id = request.session.id;
        const validUser = await db.isRealUser(id); 
        if (validUser) {
            return next();     
        } 
    }
    return response.status(400).json({error: "Корзина очищена", message: "Скорее всего Ваша корзина была очищена по таймеру. Пожалуйста, перейдите в телеграм и запустите бота."}); 
}

