import { param } from "express-validator";

export const idParamVld_Req = () => {
    return param('id', 'Incorrect id parameter').trim().exists().isString();
}