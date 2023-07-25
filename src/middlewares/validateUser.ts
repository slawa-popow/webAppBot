
import { Request, Response, NextFunction } from "express";
import { db } from '../database/db';

export async function validateUser(request: Request, response: Response, next: NextFunction) {
    console.log('validateUser: ', request.session!.id) 
    const id = request.params.id;
    if (id) {
        const validUser = await db.isRealUser(id);
        if (validUser) {
            return next();     
        } else {
            request.session = undefined;
        }
    }
    return response.status(400).json({error: "<-- Ресурс временно не доступен -->"});
}


export async function validUsr(request: Request, response: Response, next: NextFunction) {
    console.log('validUsr: ', request.session!.id) 
    if (request.session) {
        const id = request.session.id;
        const validUser = await db.isRealUser(id); 
        if (validUser) {
            return next();     
        } 
    }
    return response.status(400).json({error: "<-- Ресурс временно не доступен -->"}); 
}

