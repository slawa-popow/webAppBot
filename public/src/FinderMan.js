

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
     * @param {Array} arrCharts характеристики ['крепкие', 'синие', ...] 
     * @returns {Array | null}
     */
    async  getFindByCharacters(pack) {
        try {
            if (!this.hc)
                throw new Error('HostConnector instance is null or undefined');
            return await this.hc.getFindByCharacters(pack); 
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