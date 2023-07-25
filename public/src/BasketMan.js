

export class BasketMan {

    constructor(hostConnector) {
        this.hc = hostConnector;
        this.vapee = null;
        this.userBasket = [];
    }

    operatiopWithProdusts(result) {
        if (Array.isArray(result)) {
            this.userBasket.length = 0;
            this.userBasket.push(...result);
            return this.userBasket;
        } 
        return result;
    }


    async removeProduct(userId, id) { 
        const result = await this.hc.removeProduct(userId, id);
        return this.operatiopWithProdusts(result);
    }


    async addProduct(userId, id) {
        const result = await this.hc.addProduct(userId, id);
        return this.operatiopWithProdusts(result);
    }



}