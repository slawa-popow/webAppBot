const prodURL = 'https://web-app-bot-five.vercel.app/'
const devURL = '/';
const URL = prodURL;

/**
 * очистить содержимое
 * clearContent(document.getElementById('cnt'));
 * @param {HTMLDivElement} container
 * @returns {boolean} result cleaning
 */
function clearContent(container) {
    try {
        for (let domElem of Array.from(container.children)) {
            container.removeChild(domElem);
        }
    } catch (e) { 
        console.log('Error in clearContent() try/catch', e);
        return false;
    }
    return true;
}


async function getCategory() {
    const response = await axios.post(URL+'getCategory', {})
                                .catch( error => {
                                    if (error.response) {
                                        // Запрос был сделан, и сервер ответил кодом состояния, который
                                        // выходит за пределы 2xx
                                        console.log(error.response.data);
                                        console.log(error.response.status);
                                        console.log(error.response.headers);
                                      } else if (error.request) {
                                        // Запрос был сделан, но ответ не получен
                                        // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
                                        // http.ClientRequest в node.js
                                        console.log(error.request);
                                      } else {
                                        // Произошло что-то при настройке запроса, вызвавшее ошибку
                                        console.log('Error', error.message);
                                      }
                                      console.log(error.config);
                                });
    console.log(response.data);
    return response.data.categories || [];
}


async function getDataPage() {
    const data = await axios.post(URL+'assort');
    
    const alls = data.data;
    if (Object.keys(alls).length === 2 ) {
    return [alls.paramId, alls.allProducts];
    } else {
        return [null, null];
    }
}

/**
* 
* @param {Array} arrObjs 
*/
async function getConcreteData(arrObjs) {

    arrObjs.forEach((v, i) => {
        const vprice = getPriceMap(v);
        let htmlPrice = '';
        if (vprice.length > 0) {
            for (let [name, price] of vprice) {
            htmlPrice += `<p class='subtitle'> <span class="from">${name} </span><span class="summa"> ${price}</span></p>`;
            }
        }
        const vid = v.id;
        const count_on_stock = +v.count_on_stock || 0;
        ticket = $(`
            <div class="Cart-Container" id="cnt">
            <div class="Header">
                <p class="Heading">${vid || '##'}</p>
                <h3 class="Heading">${v.category || ''}</h3>
            </div>
                <div class='Cart-Items'>
                    <div class='image-box'>
                        <img src=${v.photo || ''}>
                    </div>
                    <div class='about'>
                        <p class='title'>Цены:</p>
                        ${htmlPrice}
                    </div>
                    <div  class='counter'>
                        <div id='minus_${vid}' class='btn'>-</div>
                        <div id='count_${vid}' class='count'>0</div>
                        <div id=plus_${vid} class='btn btn-plus'>+</div>
                    </div>
                    <div class='about'>
                        <p class='title'>${v.brand || ''}</p>
                        <p class='subtitle'>${v.name_taste || ''}</p>
                        <p class="title">В наличии:</p>
                        <p class="subtitle">${v.count_on_stock || ''}</p>
                    </div>
                    
                </div>
            </div>
        `);
        
        $('#cnt').append(ticket);

        ((id, onStock)=>{
            
            $( `#plus_${id}` ).on( "click", async (e) => {
                console.log('plus ', e.target.id.split('_')[1]);
                let currCnt = $(`#count_${id}`).text();
                currCnt = ((+currCnt >= 0) && (+currCnt <= onStock)) ? (+currCnt) + 1 : currCnt;
                $(`#count_${id}`).text(''+currCnt);
            });
            $( `#minus_${id}` ).on( "click", async (e) => {
                let currCnt = $(`#count_${id}`).text();
                currCnt = (+currCnt > 0) ? (+currCnt) - 1 : currCnt;
                $(`#count_${id}`).text(''+currCnt);
            });
            
            
        })(vid, count_on_stock);

    });
} 

function getPriceMap(obj) {
    // console.log(obj)
    const keysMap = {
            'price_from_1to2': 'от 1 до 2',
            'price_from_3to4': 'от 3 до 4',
            'price_from_5to9': 'от 5 до 9',
            'price_from_10to29': 'от 10 до 29',
            'price_from_30to69': 'от 30 до 69',
            'price_from_70to149': 'от 70 до 149',
            'price_from_150': 'от 150'
    };
    const priceMap = [];
    for (let [k, v] of Object.entries(keysMap)) {
        if (obj[k] !== 0) {
        priceMap.push([v, obj[k] || '']);  
        }
    }
    return priceMap;
}

async function createTable() {

    const [usid, allData] = await getDataPage()
    if (!usid || !allData) 
        console.log('Empty data from server.')
    $('#usid').text(`Твой telegram id = ${usid}`);

    await getConcreteData(allData); // array div's  
    
    
}

(async () => {
    $( function() {
        $( "#tabs" ).tabs({collapsible: true});
      } );

    const cats = await getCategory();
    let sortCats = [...cats].sort();
    if (cats.length > 0) {
        $('#tabs-1').append(`${sortCats.map(v => {
            return `<a class='resp-category' href="#"><button>${v}</button></a>`
        })
        .join('\n')}`);
    }
})();


createTable();