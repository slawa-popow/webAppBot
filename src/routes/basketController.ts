// import { Request, Response } from 'express';
// import { NextFunction } from 'express';
// import { Product } from '../types/Product';
// import { mysqlClient } from '../database/MysqlClient';
// import { db } from '../database/db'; 
// import { myValidationResult } from '../customErrors/customErrField';
// import { htmlspecialchars_decode } from '../middlewares/postValidate';



class BasketController {

    /**
     *  Вернуть все записи
     */
    // async getAllBlogs(_request: Request, response: Response) {
    //     const products = await db.getAllNotes();
    //     const result = (products && products.some((v) => Object.keys(v).length > 0)) ? products: [];
        
    //     response.status(200).json(result);
    // }


    /**
     * Вернуть запись блога по id
     */
    // async getBlogById(request: Request, response: Response) {
    //     const id = request.params.id;
    //     const blog = await db.getNoteById(id);
    //     const ok = (Array.isArray(blog) && blog && blog.some((v) => Object.keys(v).length > 0));
    //     if ( ok ) {
    //         let b: Blog = blog[0];
    //         b.id = '' + b.id;
    //         b.websiteUrl = htmlspecialchars_decode(b.websiteUrl);
    //         return response.status(200).json(b);
    //     }
    //     return response.status(404).json({error: "Not Found"})
    // }   

    

    // /**
    //  * Вставить в таблицу бд запись и вернуть/не вернуть ее
    //  */
    // async postBlog(request: Request, response: Response) {
    //     const errors = myValidationResult(request);
         
    //     if (!errors.isEmpty()) {
    //         return response.status(400).json( { errorsMessages: errors.array({onlyFirstError: true}) } ); // только первые показать
    //     } 
    //     const post: Blog = request.body;
    //     const newNote = await db.createNote(post);
        
    //     if (Array.isArray(newNote)) {
    //         let note: Blog = newNote[0];
    //         note.websiteUrl = htmlspecialchars_decode(note.websiteUrl);
    //         note.id = '' + note.id;
    //         return response.status(201).json(note); 
    //     }
    //     newNote!.id = '' + newNote!.id;
    //     newNote!.websiteUrl = htmlspecialchars_decode(newNote!.websiteUrl);
    //     return response.status(201).json(newNote);
    // }


    // /**
    //  * Изменить запись по id 
    //  */
    // async putBlog(request: Request, response: Response) {
    //     const errors = myValidationResult(request);
    //     if (!errors.isEmpty()) {
    //         return response.status(400).json( { errorsMessages: errors.array({onlyFirstError: true}) } ); 
    //     }
    //     const id = request.params.id;
    //     const req_note: Blog = request.body;
    //     const r = await db.putNoteById(id, req_note);
    //     if (Array.isArray(r) && r.length > 0) {
    //         const result: Blog = r[0];
    //         result.websiteUrl = htmlspecialchars_decode(result.websiteUrl);
    //         result.id = '' + result.id
    //         return response.status(204).json();
    //     } else { 
    //         return response.status(404).send('Not found');
    //     }
    // }
}

export const basketController  = new BasketController()