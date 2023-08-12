import { Router } from "express";
import { mainController } from "./MainController";
import { validateUser, validUsr} from "../middlewares/validateUser";


const mainRouter = Router(); 

mainRouter.get('/',validateUser, mainController.getIndexPage);
mainRouter.get('/basket', validateUser, mainController.getBasketPage);
mainRouter.post('/getCategory', validUsr, mainController.getAllCategory);
mainRouter.post('/getTenProd', validUsr, mainController.getTenProd);
mainRouter.post('/getUsid', validUsr, mainController.getUserId); 
// mainRouter.put('/addProductOnBasket', validUsr, mainController.addToBasket);
mainRouter.put('/removeProductFromBasket', validUsr, mainController.removeFromBasket);
mainRouter.put('/fillUserBasket', validUsr, mainController.fillUserBasket)
mainRouter.post('/getFindByCharacteristics', validUsr, mainController.searchByCharacts);
mainRouter.post('/getCalculate', validUsr, mainController.getCalculate);
mainRouter.post('/getUsrBasket', validUsr, mainController.getUsrBasket);
mainRouter.post('/deleteProduct', validUsr, mainController.delProduct);

mainRouter.post('/getAllOnStock', mainController.getAllOnStock);
// mainRouter.get('/Djiugurda', mainController.fromMySklad); 

export { mainRouter };  