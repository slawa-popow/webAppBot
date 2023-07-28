


export class StockMan {

    constructor(finderMan) {
        this.finderMan = finderMan;
        this.vapee = null;
    }

    /**
     * Вернуть 10 карточек товаров
     * @returns {[{}] | null} 
     */
    async getTenProducts() {
        if (!this.finderMan) {
            throw new Error("\nError in StockMan->getTenProducts(): finderMan is null\n")
        }
        return await this.finderMan.getTenProducts();
    }


    /**
     * Запрос на поиск по характеристикам
     * @param {object} forRequest данные из полей для поиска  
     */
    async findByCharacteristics(forRequest) {
        if (this.finderMan) {
            const result = await this.finderMan.getFindByCharacteristic(forRequest);
            return result;
            }
        return null;
    }

    async getCategory() {
       return await this.finderMan.getCategory();
    }

}