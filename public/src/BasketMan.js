

export class BasketMan {

    constructor(hostConnector) {
        this.hc = hostConnector;
        this.vapee = null;
        this.userBasket = [];
        this.userCart = {};
        this.usid = null;
    }

    operatiopWithProdusts(result) {
        if (Array.isArray(result)) {
            this.userBasket.length = 0;
            this.userBasket.push(...result);
            return this.userBasket;
        } 
        return this.userBasket;
    }


    async removeProduct(userId, id) { 
        this.usid = userId;
        if (this.userCart) {
            if (!this.userCart.hasOwnProperty(id)) {
                this.userCart[id] = 1;
            } else {
                if (+this.userCart[id] - 1 === 0) {
                    delete this.userCart[id]
                } else {
                    this.userCart[id] = +this.userCart[id] - 1; 
                } 
            }

        }
        
    }


    async addProduct(userId, id) {
        this.usid = userId;
        if (this.userCart) {
            if (!this.userCart.hasOwnProperty(id)) {
                this.userCart[id] = 1;
            } else {
                this.userCart[id] = +this.userCart[id] + 1; 
            }
        }
    }

    async fillBasket() {
        const result = await this.hc.fillBasket(this.usid, this.userCart);
        return this.operatiopWithProdusts(result);
    }

    async getBasket(userId) {
        const result = await this.hc.getBasket(userId);
        return result;
    }

    async delProduct(userId, idProduct) {
        return await this.hc.delProd(userId, idProduct);
    }

}