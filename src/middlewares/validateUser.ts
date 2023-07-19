
import { Request, Response, NextFunction } from "express";
import { db } from '../database/db';

export async function validateUser(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    if (id) {
        const validUser = await db.isRealUser(id);
        if (validUser) {
            return next();     
        } else {
            request.session!.id = undefined;
        }
    }
    return response.status(400).send("Ресурс не доступен.");
}


export async function postValidateUser(request: Request, response: Response, next: NextFunction) {

    if (request.session && request.session.id) {
        const validUser = await db.isRealUser(request.session.id);
        if (validUser) {
            return next(); 
        } else {
            request.session!.id = undefined;
        }
    }
    return response.status(404).send("Ресурс не доступен."); 
}