import { Router } from "express";
import { mainController } from "./MainController";
import { validateUser, validUsr} from "../middlewares/validateUser";


const mainRouter = Router(); 

mainRouter.get('/main/:id',validateUser, mainController.getIndexPage);
mainRouter.post('/getCategory', mainController.getAllCategory);
mainRouter.post('/getTenProd', mainController.getTenProd);
mainRouter.post('/getUsid', validUsr, mainController.getUserId); 
mainRouter.post('/addProductOnBasket', mainController.addToBasket)
mainRouter.post('/removeProductFromBasket', mainController.removeFromBasket)


export { mainRouter }