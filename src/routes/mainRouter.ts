import { Router } from "express";
import { mainController } from "./MainController";
import {  validateUser } from "../middlewares/validateUser";



const mainRouter = Router(); 

mainRouter.get('/', validateUser, mainController.getIndexPage);
mainRouter.get('/basket',  mainController.getBasketPage);
mainRouter.post('/getCategory',  mainController.getAllCategory);
mainRouter.post('/getTenProd', mainController.getTenProd);
mainRouter.post('/getUsid',  mainController.getUserId); 
// mainRouter.put('/addProductOnBasket', validUsr, mainController.addToBasket);
mainRouter.put('/removeProductFromBasket',  mainController.removeFromBasket);
mainRouter.put('/fillUserBasket',  mainController.fillUserBasket)
mainRouter.post('/getFindByCharacteristics',  mainController.searchByCharacts);
mainRouter.post('/getCalculate',  mainController.getCalculate);
mainRouter.post('/getUsrBasket',  mainController.getUsrBasket);
mainRouter.post('/deleteProduct',  mainController.delProduct);

mainRouter.post('/getAllOnStock', mainController.getAllOnStock);
// mainRouter.get('/Djiugurda', mainController.fromMySklad); 

export { mainRouter };  