import { Router } from "express";
import { mainController } from "./MainController";
import { validateUser, validUsr} from "../middlewares/validateUser";


const mainRouter = Router(); 

mainRouter.get('/',validateUser, mainController.getIndexPage);
mainRouter.post('/getCategory', validUsr, mainController.getAllCategory);
mainRouter.post('/getTenProd', validUsr, mainController.getTenProd);
mainRouter.post('/getUsid', validUsr, mainController.getUserId); 
mainRouter.put('/addProductOnBasket', validUsr, mainController.addToBasket);
mainRouter.put('/removeProductFromBasket', validUsr, mainController.removeFromBasket);
mainRouter.post('/getFindByCharacteristics', validUsr, mainController.searchByCharacts);
mainRouter.post('/getCalculate', validUsr, mainController.getCalculate);
//
mainRouter.get('/Djiugurda', mainController.fromMySklad); 

export { mainRouter };  