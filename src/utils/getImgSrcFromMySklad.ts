
import axios from "axios";
import dotenv from 'dotenv';
import { ResultFromMySklad } from "../types/ResultFromMySklad";


dotenv.config();


/**
 * Получить картинку и кол-во из МойСклад по айди модификации
 * @param uuid айди модификации
 * @returns url картинки, кол-во или нулл
 */
export const getImgSrcFromMySklad: (uuid: string) => Promise<ResultFromMySklad> = async (uuid: string) => {
    const url: string = `https://online.moysklad.ru/api/remap/1.2/entity/product/${uuid}?expand=images`;
    const token = process.env.MOISKLAD_TOKEN;
    const resultFromMySklad: ResultFromMySklad = {img: '', variantsCount: 0};
    try {
        const result = await axios.get(url, {
            headers: {'User-Agent': 'Plitochka.by client', 'Accept': '*/*', 
                      'Content-Encoding': 'gzip, deflate, br', 'Connection': 'keep-alive',
                      'Authorization': `Bearer ${token}`, }
        },);

        if (result && result.data && result.data.images && 
            result.data.images.rows && Array.isArray(result.data.images.rows)) {
            const rows = result.data.images.rows as Array<any>;
            if (rows[0] && rows[0].miniature  && rows[0].miniature.downloadHref) {
                resultFromMySklad.img = rows[0].miniature.downloadHref || '';
                resultFromMySklad.variantsCount = result.data.variantsCount || 0;  
            } 
        }
    } catch (e) { console.error(`Err in getImgSrcFromMySklad()->catch`, e) }
    return resultFromMySklad;
};

/**       [
 *          miniature: {
[debug]       href: 'https://online.moysklad.ru/api/remap/1.2/download/b1ffbfc7-8960-45a5-806f-c8aa544e639d?miniature=true',
[debug]       type: 'image',
[debug]       mediaType: 'image/png',
[debug]       downloadHref: 'https://miniature-prod.moysklad.ru/miniature/b492d5f5-b81c-11ec-0a80-0f8b0000ae7e/documentminiature/2ea102d3-816b-42b0-8da1-5baeb24b5060'
 *         ]
 */