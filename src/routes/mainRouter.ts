import { Router } from "express";
import { mainController } from "./MainController";
import { validateUser, validUsr } from "../middlewares/validateUser";


const mainRouter = Router(); 

mainRouter.get('/:id', validateUser, mainController.getIndexPage);
mainRouter.post('/getCategory', validUsr, mainController.getAllCategory);
mainRouter.post('/getTenProd', mainController.getTenProd)


export { mainRouter }