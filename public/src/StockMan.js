


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
     * @param {Array} arrCharts характеристики ['крепкие', 'синие', ...] 
     */
    async findByCharacteristics(arrCharts) {
        if (this.finderMan && Array.isArray(arrCharts) && arrCharts.length > 0) {
            const pack = {characteristics: [...arrCharts]};
            const result = await this.finderMan.findByCharacteristics(pack);
            return result;
        }
        throw new Error('\nError in StockMan->findByCharacteristics(): Not defined finderMan or empty characteristics array\n');
    }

    async getCategory() {
       return await this.finderMan.getCategory();
    }

}