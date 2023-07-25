import axios from "axios";

export class HostConnector {

    api = {
        getCats: 'getCategory',
        getUsId: 'getUsid',
        getTenProd: 'getTenProd',
        getFindByChars: 'getFindByCharacteristics',
        addProductOnBasket: 'addProductOnBasket',
        removeProductFromBasket: 'removeProductFromBasket',
        clearBasket: 'clearBasket',
        doOrder: 'doOrder',
        returnToTg: 'returnToTelegram'
    }
    
    constructor(url) {
        this.host = url;
    }


    /**
     * Получить айди (корзину) юзера
     */
    async getUserId() {
        try {
            const url =  this.host + this.api.getUsId;
            const resp = await axios.post(url, {});
            
            return resp.data;
        } catch (e) {
            console.error('Error in HostConnector->getUserId() ', error);
            return(e.response.data);
        }
       
    }


    /**
     * Вернуть категории товаров
     * @returns 
     */
    async getCategory() {
        try {
            const url =  this.host + this.api.getCats;
            const response = await axios.post(url, {})
            return response.data.categories || [];

        } catch (error) { console.error('Error in FinderMan->getCategory()', error); } 
        return null;
    }


    /**
     * Добавить товар в корзину.
     * @param {string | number} id 
     */
    async addProduct(userId, id) {
        try {
            const url = this.host + this.api.addProductOnBasket;
            const resp = await axios.post(url, {userId: userId,idProduct: id});
            return resp.data;

        } catch (e) { 
            console.log('Error in HostConnector->addProduct() ', e); 
            return(e.response.data);
        }
    }


    async removeProduct(userId, id) {
        try {
            const url = this.host + this.api.removeProductFromBasket;
            const resp = await axios.post(url, {userId: userId,idProduct: id});
            return resp.data;

        } catch (e) { 
            console.log('Error in HostConnector->removeProduct() ', e); 
            return(e.response.data);
        }
    }


    /**
     * Вернуть 25 карточек товаров
     * @returns {Array | null}
     */
    async getTenProducts() {
        try {
            const url = this.host + this.api.getTenProd;
            const response = await axios.post(url, {});
    
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