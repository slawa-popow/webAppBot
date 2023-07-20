import { Router } from "express";
import { mainController } from "./MainController";
import { idParamVld_Req } from "../middlewares/getValidate";
import { validateUser, validUsr } from "../middlewares/validateUser";
// import { idVld_Resp } from "../middlewares/postValidate";



const mainRouter = Router(); 

mainRouter.get('/:id',idParamVld_Req(), validateUser, mainController.getIndexPage);
mainRouter.post('/assort', mainController.getAssort);
mainRouter.post('/getCategory', validUsr, mainController.getAllCategory);


export { mainRouter }