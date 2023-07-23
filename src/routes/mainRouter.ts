import { Router } from "express";
import { mainController } from "./MainController";
import { validateUser, validUsr } from "../middlewares/validateUser";
// import { idVld_Resp } from "../middlewares/postValidate";



const mainRouter = Router(); 

mainRouter.get('/:id', validateUser, mainController.getIndexPage);
mainRouter.post('/assort', mainController.getAssort);
mainRouter.post('/getCategory', validUsr, mainController.getAllCategory);


export { mainRouter }