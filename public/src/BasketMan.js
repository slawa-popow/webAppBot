

export class BasketMan {

    constructor(hostConnector) {
        this.hc = hostConnector;
        this.vapee = null;
        this.userBasket = [];
    }


    async addProduct(userId, id) {
        const result = await this.hc.addProduct(userId, id);
        if (Array.isArray(result)) {
            this.userBasket.length = 0;
            this.userBasket.push(...result);
            return this.userBasket;
        }
        return result;
    }



}