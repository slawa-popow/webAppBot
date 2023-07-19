
import { ResultFactory, validationResult } from 'express-validator';
 

// Форма сообщений ошибок согласто тз
type MyCustomErrField = {message: string; field: string};

// пользовательское сообщение ошибок. (err: any) иначе не знаю как вытащить имя поля ошибки
export const myValidationResult: ResultFactory<MyCustomErrField> = validationResult.withDefaults({
  formatter: (err) => ({ message: err.msg, field: err.type === 'field'? err.path : 'unknow_err' }),
});

