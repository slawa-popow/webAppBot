import axios from "axios";
import dotenv from 'dotenv';
import { ResponseReportStock, ReportBalance } from "../types/ReportBalance";


dotenv.config();

export async function getAllBalanceReport(): Promise<ReportBalance[]> {
    const url: string = `https://online.moysklad.ru/api/remap/1.2/report/stock/all`;
    const token = process.env.MOISKLAD_TOKEN;

    try {

        const result  = await axios.get(url, {
            headers: {'User-Agent': 'Plitochka.by client', 'Accept': '*/*', 
                      'Content-Encoding': 'gzip, deflate, br', 'Connection': 'keep-alive',
                      'Authorization': `Bearer ${token}`, }
        },);
        const resultData: ResponseReportStock = result.data;
        // console.log(resultData);
        return resultData.rows;

    } catch (err) { 
        console.log(`Error -> getAllBalanceReport() try/catch `, err);
    }
    return [];
}