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


/**
 * Validation field websiteUrl
 */
export const urlVld_Req = () => {
    
    return body('websiteUrl').exists().withMessage('Не существует')
    .isString().withMessage('Is not string type')
    .trim().isLength({min: 0, max: 100}).withMessage('Cлишком длинное значение поля')
    .matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').withMessage('Incorrect URL')
    .escape()
    
}
type MapDecode = Record<string, string>;

/**
 * Декодер
 * @param str кодированная строка .escape() validator sanitazer 
 * @returns нормальная строка
 */
export function htmlspecialchars_decode(str: string): string {
   const map: MapDecode = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&#39;": "'",
    "&#x2F;": "/",
    };
    return str.replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g, (m) => { return (map[m]); });
}
