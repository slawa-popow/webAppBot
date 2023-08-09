import axios from "axios";

export class HostConnector {

    api = {
        getUserBasket: 'getUsrBasket',
        fill: 'fillUserBasket',
        calculate: 'getCalculate',
        deleteProduct: 'deleteProduct',
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


    async getBasket(usid) {
        try {
            const url =  this.host + this.api.getUserBasket;
            const response = await axios.post(url, {userId: usid})
            return response.data || [];

        } catch (error) { console.error('Error in FinderMan->getBasket()', error); } 
        return null;
    }

    /**
     * Получить айди (корзину) юзера
     */
    async getUserId(initData) {
        try {
            const url =  this.host + this.api.getUsId;
            const resp = await axios.post(url, {initData: initData});
            
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
            return response.data || [];

        } catch (error) { console.error('Error in FinderMan->getCategory()', error); } 
        return null;
    }

    async fillBasket(usid, prods) {
        try {
            const url = this.host + this.api.fill;
            const resp = await axios.put(url, {userId: usid, idProducts: prods});
            return resp.data;
 
        } catch (e) { 
            console.log('Error in HostConnector->fillBasket() ', e); 
            return(e.response.data);
        }
    }

    /**
     * Добавить товар в корзину.
     * @param {string | number} id 
     */
    async addProduct(userId, id) {
        try {
            const url = this.host + this.api.addProductOnBasket;
            const resp = await axios.put(url, {userId: userId, idProduct: id});
            return resp.data;
 
        } catch (e) { 
            console.log('Error in HostConnector->addProduct() ', e); 
            return(e.response.data);
        }
    }

    async delProd(usid, id) {
        try {
            const url = this.host + this.api.deleteProduct;
            const resp = await axios.post(url, {userId: usid, idProduct: id});
            return resp.data;

        } catch (e) { 
            console.log('Error in HostConnector->delProd() ', e); 
            return [];
        }
    }


    async removeProduct(userId, id) {
        try {
            const url = this.host + this.api.removeProductFromBasket;
            const resp = await axios.put(url, {userId: userId, idProduct: id});
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

    async getCalculate(userId) {
        try {
            const url = this.host + this.api.calculate;
            const response = await axios.post(url, {userId: userId});
    
            return response.data;
        }
        catch (error) { console.error('Error in HostConnector->getCalculate() ', error); }
        return null
        
    }

    /**
     * Запрос на поиск по характеристикам
     * @param {object} 
     * @returns {Array | null} 
     */
    async getFindByCharacters(pack) {
        try {
            if (!pack || !pack.characteristics)
                throw new Error('Empty pack. POST request is not possible.');
            console.log('ok');
            const url = this.host + this.api.getFindByChars;
            const response = await axios.post(url, pack);
            return response.data;
        }
        catch (error) { console.error('Error in HostConnector->getFindByCharacters() ', error); }
        return null
    }
}