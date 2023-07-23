import { body } from "express-validator"

/**
 * Не исп.
 */
export const idVld_Resp = () => {
    return body('id').exists().withMessage('Не существует')
    .isString().withMessage('Не строка')
    .isLength({min:1, max:25}).withMessage("Incorrect length id")
}
// ----------------------------------------------------------------------------------------------

/**
 * Validation field name
 */
export const nameVld_Req = () => {
    return body('name').exists().withMessage('Не существует')
    .isString().withMessage('Не строка')
    .trim().isLength({min: 0, max: 15}).withMessage('Cлишком длинное значение поля')
}

/**
 * Validation field description
 */
export const descVld_Req = () => {
    return body('description').exists().withMessage('Не существует')
    .isString().withMessage('Is not string type')
    .trim().isLength({min: 0, max: 500}).withMessage('Cлишком длинное значение поля')
}




