import { Router } from "express";
import { mainController } from "./MainController";
import { validateUser, validUsr} from "../middlewares/validateUser";


const mainRouter = Router(); 

mainRouter.get('/',validateUser, mainController.getIndexPage);
mainRouter.post('/getCategory', validUsr, mainController.getAllCategory);
mainRouter.post('/getTenProd', validUsr, mainController.getTenProd);
mainRouter.post('/getUsid', validUsr, mainController.getUserId); 
mainRouter.post('/addProductOnBasket', validUsr, mainController.addToBasket);
mainRouter.post('/removeProductFromBasket', validUsr, mainController.removeFromBasket);
//
// mainRouter.get('/Djiugurda', mainController.fromMySklad);

export { mainRouter }