import axios from "axios";

export class HostConnector {

    HOSTDEV = 'localhost:4011';

    api = {
        getTenProd: '/getTenProd',
        getFindByChars: '/getFindByCharacteristics',
        addProduct: '/addProductOnBasket',
        removeProduct: '/removeProductFromBasket',
        clearBasket: '/clearBasket',
        doOrder: '/doOrder',
        returnToTg: '/returnToTelegram'
    }
    
    constructor() {
        this.host = this.HOSTDEV;
    }


    /**
     * Вернуть 10 карточек товаров
     * @returns {Array | null}
     */
    async getTenProducts() {
        try {
            const url = this.host + this.api.getTenProd;
            const response = await axios.get(url);
            // console.log(response);
            return response.data;
        } catch (error) { console.error('Error in HostConnector->getTenProducts() ', error); }
        return null;
    }


    /**
     * Запрос на поиск по характеристикам
     * @param {characteristics: string[]} 
     * @returns {Array | null} 
     */
    async getFindByCharacters(pack) {
        try {
            if (!pack || !pack.characteristics)
                throw new Error('Empty pack. POST request is not possible.');
            const url = this.host + this.api.getFindByChars;
            const response = await axios.post(url=url, data=pack);
            return response.data;
        }
        catch (error) { console.error('Error in HostConnector->getFindByCharacters() ', error); }
        return null
    }
}