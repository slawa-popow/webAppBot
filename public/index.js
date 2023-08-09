
import 'webpack-jquery-ui/interactions';
import 'webpack-jquery-ui/widgets';
import 'webpack-jquery-ui/effects';
import { Vapee } from "./src/Vapee";
import { StockMan } from "./src/StockMan";
import { FinderMan } from "./src/FinderMan";
import { HostConnector } from "./src/HostConnector";
import { BasketMan } from "./src/BasketMan";
import { TicketMan } from "./src/TicketMan";

const prodURL = 'https://web-app-bot-b.vercel.app/' 
const devURL = '/';
const URL = prodURL;


window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();
let iData = window.Telegram.WebApp.initData || "";

    const hostConnector = new HostConnector(URL);
    const finderMan = new FinderMan(hostConnector);
    const stockMan = new StockMan(finderMan);
    const basketMan = new BasketMan(hostConnector);
    const ticketMan = new TicketMan(hostConnector);
    
    
    const vapee = new Vapee(
        stockMan,
        basketMan,
        ticketMan,
        hostConnector 
    );
    
    function startStyle() {
        $('.set-cats').css('max-height', () => {
            return +$(window).height()-320;
        } );
        $('.set-cats').css('overflow-y', 'scroll');
        $('#in-basket').css('max-height', () => {
            return +$(window).height()-190;
        });
        $('#in-basket').css('overflow-y', 'scroll');
    }
    vapee.init(iData); 

    $('#close').on('click', (e) => { 
        window.Telegram.WebApp.sendData("order-off") 
    });

    $( window ).on( "resize", () => {
        startStyle();
    });

    startStyle();
    
    


 









// -------------------------------------------------------------------------
