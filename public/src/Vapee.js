

export class Vapee {

    userId = null;

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
        
    }

    async init() {
        this.userId = await this.getUsId();
        await this.ticketMan.makeStartContent();
    }

    async getUsId() {
        const respUsrId = await this.hc.getUserId();
        return respUsrId.usid;
    }

}