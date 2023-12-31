

export class Vapee {

    

    /**
     * @param {StockMan} stockMan 
     * @param {BasketMan} basketMan 
     * @param {TicketMan} ticketMan 
     * @param {HostConnector} hostConnector 
     */
    constructor(stockMan, basketMan, ticketMan, hostConnector) {
        this.stockMan = stockMan;
        this.basketMan = basketMan;
        this.ticketMan = ticketMan;
        this.hc = hostConnector;
        this.stockMan.vapee = this; 
        this.basketMan.vapee = this;
        this.ticketMan.vapee = this;
        this.userId = null;
        
    }

    async getUSID() {
        const result = await this.hc.getUserId('');
        const usid = result.usid;
        return usid;
    }
    
    async init() {
         
        const userId = await this.getUsId();
        if (userId) {
            this.userId = userId;
            this.basketMan.usid = this.userId;
            const tenProd = await this.stockMan.getTenProducts();
            this.ticketMan.setData(tenProd);
            await this.ticketMan.viewStartProducts();
        }
    }

    async getUsId() {
        const result = await this.hc.getUserId();
        const usid = result.usid;
        if (usid) {
            if (Array.isArray(result.basket)) {
                this.basketMan.userBasket.push(...result.basket);
            }
        
            return usid;
        }
        
        this.ticketMan.clearContent(result);
        return null;
    }

}