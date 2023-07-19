
/**
 * Ответ от базы после записи.
 * Мне нужно insertId - номер последней записанной 
 * строки в таблице
 */
export interface OkPacket {
    fieldCount?: number,
    affectedRows?: number,
    insertId: number,
    serverStatus?: number,
    warningCount?: number,
    message?: string,
    protocol41?: boolean,
    changedRows?: number
}

