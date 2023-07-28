

export class FinderMan {

    constructor(hostConnector) {
        this.hc = hostConnector;
        this.vapee = null;
    }

    /**
     * Вернуть 10 карточек товаров
     * @returns {Array | null}
     */
    async getTenProducts() {
        try {
            if (!this.hc)
                throw new Error('HostConnector instance is null or undefined');
            return await this.hc.getTenProducts();
        } catch (error) { console.error('Error in FinderMan->getTenProducts()', error); }        
        return null;
    }   

    
    /**
     * Запрос на поиск по характеристикам
     * @param {object} forRequest данные из полей для поиска 
     * @returns {Array | null}
     */
    async  getFindByCharacteristic(forRequest) {
        try {
            if (!this.hc)
                throw new Error('HostConnector instance is null or undefined');
            return await this.hc.getFindByCharacters(forRequest); 
        } catch (error) { console.error('Error in FinderMan->getFindByCharacters()', error); }        
        return null;
    }


    /**
     * Вернуть категории товаров
     * @returns 
     */
    async getCategory() {
        try {
            const response = await this.hc.getCategory();
            return response;

        } catch (error) { console.error('Error in FinderMan->getCategory()', error); } 
        return null;
    }
}