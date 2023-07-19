
import { Request, Response, NextFunction } from "express";
import { db } from '../database/db';

export async function validateUser(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    if (id) {
        const validUser = await db.isRealUser(id);
        if (validUser) {
            return next();     
        }
    }
    return response.status(400).send("get Ресурс не доступен.");
}

