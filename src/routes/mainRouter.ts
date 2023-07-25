import { Router } from "express";
import { mainController } from "./MainController";
import { validateUser, } from "../middlewares/validateUser";


const mainRouter = Router(); 

mainRouter.get('/:id', validateUser, mainController.getIndexPage);
mainRouter.post('/getCategory', mainController.getAllCategory);
mainRouter.post('/getTenProd', mainController.getTenProd);
mainRouter.post('/getUsid', mainController.getUserId);
mainRouter.post('/addProductOnBasket', mainController.addToBasket)
mainRouter.post('/removeProductFromBasket', mainController.removeFromBasket)


export { mainRouter }