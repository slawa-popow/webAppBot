
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

(async () => {
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
    
    await vapee.init(); 

})();


 









// -------------------------------------------------------------------------

// /**
//  * очистить содержимое
//  * clearContent(document.getElementById('cnt'));
//  * @param {HTMLDivElement} container
//  * @returns {boolean} result cleaning 
//  */
// function clearContent(container) {
//     try {
//         for (let domElem of Array.from(container.children)) {
//             container.removeChild(domElem);
//         }
//     } catch (e) { 
//         console.log('Error in clearContent() try/catch', e);
//         return false;
//     }
//     return true;
// }


// async function getCategory() {
//     const response = await axios.post(URL+'getCategory', {})
//                                 .catch( error => {
//                                     if (error.response) {
//                                         // Запрос был сделан, и сервер ответил кодом состояния, который
//                                         // выходит за пределы 2xx
//                                         console.log(error.response.data);
//                                         console.log(error.response.status);
//                                         console.log(error.response.headers);
//                                       } else if (error.request) {
//                                         // Запрос был сделан, но ответ не получен
//                                         // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
//                                         // http.ClientRequest в node.js
//                                         console.log(error.request);
//                                       } else {
//                                         // Произошло что-то при настройке запроса, вызвавшее ошибку
//                                         console.log('Error', error.message);
//                                       }
//                                       console.log(error.config);
//                                 });
//     console.log(response.data);
//     return response.data.categories || [];
// }
 

// async function getDataPage() {
//     const data = await axios.post(URL+'getTenProd');
    
//     const alls = data.data;
//     console.log(alls);
//     if (Object.keys(alls).length === 2 ) {
//     return [alls.paramId, alls.allProducts];
//     } else {
//         return [null, null];
//     }
// }

// /**
// * 
// * @param {Array} arrObjs 
// */
// async function getConcreteData(arrObjs) {

//     arrObjs.forEach((v, i) => {
//         const vprice = getPriceMap(v);
//         let htmlPrice = '';
//         if (vprice.length > 0) {
//             for (let [name, price] of vprice) {
//             htmlPrice += `<p class='subtitle'> <span class="from">${name} </span><span class="summa"> ${price}</span></p>`;
//             }
//         }
//         const vid = v.id;
//         const count_on_stock = +v.variantsCount || 0;
//         const ticket = $(`
//             <div class="Cart-Container" id="cnt">
//             <div class="Header">
//                 <p class="Heading">${vid || '##'}</p>
//                 <h3 class="Heading">${v['группы'] || ''}</h3>
//             </div>
//                 <div class='Cart-Items'>
//                     <div class='image-box'>
//                         <img src=${v['фото'] || ''}>
//                     </div>
//                     <div class='about'>
//                         <p class='title'>Цены:</p>
//                         ${htmlPrice}
//                     </div>
//                     <div  class='counter'>
//                         <div id='minus_${vid}' class='btn'>-</div>
//                         <div id='count_${vid}' class='count'>0</div>
//                         <div id=plus_${vid} class='btn btn-plus'>+</div>
//                     </div>
//                     <div class='about'>
//                         <p class='title'>${v['бренд'] || ''}</p>
//                         <p class="title">В наличии:</p>
//                         <p class="subtitle">${count_on_stock}</p>
//                     </div>
                    
//                 </div>
//             </div>
//         `);
        
//         $('#cnt').append(ticket);

//         ((id, onStock)=>{
            
//             $( `#plus_${id}` ).on( "click", async (e) => {
//                 console.log('plus ', e.target.id.split('_')[1]);
//                 let currCnt = $(`#count_${id}`).text();
//                 currCnt = ((+currCnt >= 0) && (+currCnt < onStock)) ? (+currCnt) + 1 : currCnt;
//                 $(`#count_${id}`).text(''+currCnt);
//             });
//             $( `#minus_${id}` ).on( "click", async (e) => {
//                 let currCnt = $(`#count_${id}`).text();
//                 currCnt = (+currCnt > 0) ? (+currCnt) - 1 : currCnt;
//                 $(`#count_${id}`).text(''+currCnt);
//             });
            
            
//         })(vid, count_on_stock);

//     });
// } 

// function getPriceMap(obj) {
//     // console.log(obj)
//     const keysMap = {
//             'цена_от_1_до_2': 'от 1 до 2: ',
//             'цена_от_3_до_4': 'от 3 до 4: ',
//             'цена_от_5_до_9': 'от 5 до 9: ',
//             'цена_от_10_до_29': 'от 10 до 29: ',
//             'цена_от_30_до_69': 'от 30 до 69: ',
//             'цена_от_70_до_149': 'от 70 до 149: ',
//             'цена_от_150': 'от 150: '
//     };
//     const priceMap = [];
//     for (let [k, v] of Object.entries(keysMap)) {
//         if (obj[k] !== 0) {
//         priceMap.push([v, obj[k] || '']);  
//         }
//     }
//     return priceMap;
// }

// async function createTable() {

//     const [usid, allData] = await getDataPage()
//     if (!usid || !allData) 
//         console.log('Empty data from server.')
//     $('#usid').text(`Твой telegram id = ${usid}`);

//     await getConcreteData(allData); // array div's  
// }

// /**
//  * <a class='resp-category' href="#"><button>${v}</button></a>
//  */

// // akkordion #set-cats
// (async () => {
//     $(function() {
//         $( "#tabs" ).tabs({collapsible: true});
//         $('#cnt').on("click", (e) => {
//             $('#tabs').tabs( "option", "active", 10 );
//         });
//     });

   
//     const cats = await getCategory();
//     let sortCats = [...cats].sort();
//     if (cats.length > 0) {
//         $('#set-cats').append(`${sortCats.map(v => {
//             return `
//             <h3>${v}</h3>
//             <div>
//               <p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque.</p>
//             </div>
//             `;
//         })
//         .join('\n')}`);
//     }

//     $( "#set-cats" ).accordion({
//         collapsible: true
//     }); 
// })();


// createTable();