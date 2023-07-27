


export class TicketMan {

    constructor(hostConnector) {
        this.hc = hostConnector;
        this.vapee = null;
        this.bucket = null; // Временное хранилище для выборок 
    }



    setData(data) {
        if (this.bucket)
            this.bucket = undefined;
        this.bucket = data;
    }

    /**
     * Получить рандомные 10 продуктов
     * @returns 
     */
    async  getTenProds() {
        try {
            const data = this.bucket;
            
            if (Object.keys(data).length === 2 ) {
                return [data.paramId, data.allProducts];
            } else {
                return [null, null];
            }
        } catch (e) { console.log('Error in getTenProds() try/catch', e); }
        return [null, null];
    }


    /**
     * Показать первые 10 карточек. Стартует первой.
     * 
     */
    async viewStartProducts() {
        const [usid, allData] = await this.getTenProds();
        if (!usid || !allData) {
            console.error('Empty data from server.')
            return;
        }
        $('#usid').text(`Твой telegram id = ${usid}`);
        $('#count-basket').text(`в корзине: ${this.vapee.basketMan.userBasket.length }`);
        await this.makeProductTickets(allData); // array div's 
        await this.makeTab(); 
        $('#loader').css({'display': 'none'})
    }


    /**
     * Создать виджет Tab jQuery
     */
    async makeTab() {
        
        $( "#tabs" ).tabs({collapsible: true});
        $('#cnt').on("click", (e) => {
            $('#tabs').tabs( "option", "active", 10 );
        });
        
// query_id=AAHrOrtzAAAAAOs6u3On2cDm&user=%7B%22id%22%3A1941650155%2C%22first_name%22%3A%22Slava%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Pwg90%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1690386445&hash=268489f1c090ca1c40483be3ea489cdf77fba5c618b6c5fe2c29910a1a5ffe15


        const cats = await this.hc.getCategory();
        let sortCats = [...cats].sort();
        if (cats.length > 0) {
            $('#set-cats').append(`${sortCats.map(v => {
                return `
                <h3>${v}</h3>
                <div >
                <p id='ddd'></p>
                </div>
                `;
            })
            .join('\n')}`);
        }

        $( "#set-cats" ).accordion({
            collapsible: true
        }); 
         
        
    }


    /**
     * Создать карточки html и вставить на страницу
     * @param {Array} arrObjs 
     */
    async makeProductTickets(arrObjs) {
        for (let v of arrObjs) {
            const vprice = this.getPriceMap(v);
            let htmlPrice = '';
            if (vprice.length > 0) {
                for (let [name, price] of vprice) {
                htmlPrice += `<p class='subtitle'> <span class="from">${name} </span><span class="summa"> ${price}</span></p>`;
                }
            }
            const vid = v.id;
            const count_on_stock = +v['количество_на_складе'] || 0;
            const ticket = $(`
                <div class="Cart-Container" id="cnt">
                <div class="Header">
                    <p class="Heading">${vid || '##'}</p>
                    <h3 class="Heading">${v['группы'] || ''}</h3>
                </div>
                    <div class='Cart-Items'>
                        <div class='image-box'>
                            <img src=${v['фото'] || ''}>
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
                            <p class='title'>${v['бренд'] || ''}</p>
                            <p class="title">В наличии:</p>
                            <p class="subtitle">${count_on_stock}</p>
                        </div>
                        
                    </div>
                </div>
            `);
            
            $('#cnt').append(ticket);
    
            (async (id, onStock)=>{
                
                $( `#plus_${id}` ).on( "click", async (e) => {
                    console.log('plus ', e.target.id.split('_')[1]);
                    let currCnt = $(`#count_${id}`).text();
                    currCnt = ((+currCnt >= 0) && (+currCnt < onStock)) ? (+currCnt) + 1 : currCnt;
                    $(`#count_${id}`).text(''+currCnt);
                    const userId = this.vapee.userId;
                    const response = await this.vapee.basketMan.addProduct(userId, id);
                    if (Array.isArray(response)) {
                        $('#count-basket').text(`в корзине: ${response.length}`);
                    } else {
                        this.clearContent(response);
                    } 
                });
                $( `#minus_${id}` ).on( "click", async (e) => {
                    let currCnt = $(`#count_${id}`).text();
                    currCnt = (+currCnt > 0) ? (+currCnt) - 1 : currCnt;
                    $(`#count_${id}`).text(''+currCnt);
                    const userId = this.vapee.userId;
                    console.log('minus ', id);
                    const response = await this.vapee.basketMan.removeProduct(userId, id);
                    if (Array.isArray(response)) {
                        $('#count-basket').text(`в корзине: ${response.length}`);
                    } else {
                        console.log(response);
                        this.clearContent(response);
                    }
                });
                
                
            })(vid, count_on_stock);
    
        }
    }
    
    /**
     * Если корзина удалени, очистить контент сообщить об 
     * необходимиости перейти в телеграм
     * @param {Response Error Message} respError объект ошибки с сервера 
     *  {error: string, message: string} 
     */
    clearContent(respError) {
        $('#count-basket').text(respError.error || 'ошибка');
        ($('#cnt')).remove();
        ($('#tabs-3-cnt')).remove();
        ($('#tabs-3')).append(`<div id="tabs-3-cnt"><p>${respError.message}</p></div>`); 

        ($('#tabs-1-cnt')).remove();
        ($('#tabs-1')).append(`<div id="tabs-1-cnt"><p>${respError.message}</p></div>`); 
    }


    /**
     * Создать карту цен для вывода и отфильтровать
     * нулевые цены.
     * @param {Object} obj 
     * @returns {Array}
     */
    getPriceMap(obj) {
        
        const keysMap = {
                'цена_от_1_до_2': 'от 1 до 2: ',
                'цена_от_3_до_4': 'от 3 до 4: ',
                'цена_от_5_до_9': 'от 5 до 9: ',
                'цена_от_10_до_29': 'от 10 до 29: ',
                'цена_от_30_до_69': 'от 30 до 69: ',
                'цена_от_70_до_149': 'от 70 до 149: ',
                'цена_от_150': 'от 150: '
        };
        const priceMap = [];
        for (let [k, v] of Object.entries(keysMap)) {
            if (obj[k] !== 0) {
            priceMap.push([v, obj[k] || '']);  
            }
        }
        return priceMap;
    }

}