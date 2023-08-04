


export class TicketMan {

    constructor(hostConnector) {
        this.hc = hostConnector;
        this.vapee = null;
        this.bucket = null;   // Временное хранилище для выборок 
        this.forRequest = {  // поиск по хар-кам
            category: '',
            characteristics: [],
            brands: [],
            searchText: ''
        };
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
        $('#count-basket').text(`кол-во позиций: ${this.vapee.basketMan.userBasket.length }`);
        let total = this.vapee.basketMan.userBasket.reduce((pv, cv) => {
            return pv + (+cv.count_on_order);
        }, 0);
        $('#total').text(`всего товаров: ${total}`);
        await this.makeProductTickets(allData); // array div's 
        await this.makeTab(); 
        $('#loader').css({'display': 'none'});
        
    }


    /**
     * Создать виджет Tab jQuery
     * heightStyle: "fill"
     */

    async viewCars() {
        $(`#finded-characteristics`).empty();
        $('#in-basket').empty();

        $('#in-basket').css('overflow-y', 'scroll');
        for (let prod of this.vapee.basketMan.userBasket) {
            const cartProd = `
                <div class="prd">
                <div id="cartProd" class="cartProd">
    
                <div id="info-cartProd" class="info-cartProd">
                    <div id="key-info-catrProd" class="key-info-catrProd">
                        <p>наименование</p>
                        <p>категория</p>
                        <p>бренд</p>
                        <p>кол-во</p>
                        <p>стоимость</p>
                    </div>
                    <div id="value-info-cartProd" class="value-info-cartProd">
                        <p>${prod.name_good || ''}</p>
                        <p>${prod.category || ''}</p>
                        <p>${prod.brand || ''}</p>
                        <p>${prod.count_on_order || ''}</p>
                        <p class="paysum">${prod.sum_position}</p>
                    </div>
                </div>
                </div>
                <div id="remove-product" class="remove-product">
                <button id="button-remove-product-from-cart-${prod.product_id}">убрать</button>
                </div>
            </div>  
            `;

            $('#in-basket').append(cartProd);
            $(`#button-remove-product-from-cart-${prod.product_id}`).on('click', async (e) => {
                let rawid = e.target.id.split('-').reverse();
                let id = rawid[0];
                
                const userId = this.vapee.userId;
                const response = await this.vapee.basketMan.removeProduct(userId, id);

                if (Array.isArray(response)) {
                    $('#count-basket').text(`кол-во позиций: ${response.length}`);
                    let total = response.reduce((pv, cv) => {
                        return pv + (+cv.count_on_order);
                    }, 0);
                    $('#total').text(`всего товаров: ${total}`);
                    $('#in-basket').empty();
                   
                    this.viewCars();
                } else {
                    this.clearContent(response);
                }
            });
        }
    }

    async makeTab() {
        
        $( "#tabs" ).tabs({collapsible: true, activate: async (e, ui) => {
            $('.finded-characteristics').css('margin-top', '0');
            
            if (ui.newPanel[0] && ui.newPanel[0].id === 'tabs-3') {
                await this.viewCars();
            }
        }});
        $('#cnt').on("click", (e) => {
            $('#tabs').tabs( "option", "active", 10 );
        });
        $( function() {
            $( "input" ).checkboxradio();
        });

        const result = await this.hc.getCategory();
        const cats = result.categories;
        // const characts = result.characteristics;
        const brands = result.brands;
        
    
        let sortCats = [...cats].sort();
        if (cats.length > 0) {
            $('#set-cats').append(`${sortCats.map( (v) => {
                // const chrs = characts[v]; // array characteristics from result.characteristics
                const idName = v.replace(/[. /:?*+^$[\]\\(){}|-]/g, '_');
                const brandsCat = brands[v];  // array brands from result.brands
                
                let checkboxBrands = brandsCat.map((nameBrand, i) => {
                    
                    let color = (i % 2 === 0) ? '#f3f3f3': 'white';
                    const checkBlock = `
                        <div id="brands-block" style="display: flex;  margin: 4px 0; flex-flow: row nowrap; justify-content: space-between; background-color: ${color};">
                        <label style="font-size: 0.8em; font-weight: bold; padding: 3px 4px;"  for="${idName}${i}">${nameBrand}</label>
                        <input style="width: 26px; height: 27px;" type="checkbox" name="${idName}" id="${nameBrand}">
                        </div>
                    `;
                    return checkBlock;
                }).join('\n');

                // let checkboxs = chrs.filter(a => {return a.length > 0})
                // .map((nameCharact, i) => {
                //     let color = (i % 2 === 0) ? '#f3f3f3': 'white';
                //     // let idNameCharact = 'cbx_'+nameCharact.replace(/[. :?*+^$[\]\\(){}|-]+/g, '_');

                //     const checkBlock = `
                    
                //         <div id="cats-block" style="display: flex;  margin: 4px 0; flex-flow: row nowrap; justify-content: space-between; background-color: ${color};">
                //         <label style="font-size: 0.8em; font-weight: bold; padding: 3px 4px;"  for="${idName}${i}">${nameCharact}</label>
                //         <input style="width: 26px; height: 27px;" type="checkbox" name="${idName}" id="${nameCharact}">
                //         </div>
                    
                //     `;
                   
                    
                //     return checkBlock;
                //     }).join('\n');

                const sumbitId = v.replace(/[. /:?*+^$[\]\\(){}|-]/g, '_');

                const searchForms =  `
                <h3>${v}</h3>
                <div>
                <p>Выбери критерии поиска:</p>
                <button class="button-find" id="submit-${sumbitId}">Поиск</button>
                    <form name=form-${sumbitId}>
                        <fieldset>
                            <legend> Бренды: </legend>
                            ${checkboxBrands}
                            
                        </fieldset>
                        
                    </form>
                    <button class="button-find" id="submit-${sumbitId}">Поиск</button>
                </div>
                `;
                 
                return searchForms;
            })
            .join('\n')}`);
        }
/*

<button class="button-find" id="submit-${sumbitId}">Поиск</button>
                        <fieldset>
                            <legend> Характеристики: </legend>
                            ${checkboxs}
                            
                        </fieldset>
*/

        $( "#set-cats" ).accordion({heightStyle: "content",
            collapsible: true, active: 10000, activate: (e, ui) => {
                if (ui.newHeader[0]) {
                    this.forRequest.category = ui.newHeader[0].textContent;
                    $(`#finded-characteristics`).empty();
                    $('input[type=checkbox]:checked').each(function () {
                        this.checked = false;
                    });
                    this.forRequest.characteristics.length = 0;
                } else {
                    this.forRequest.category = '';
                    this.forRequest.characteristics.length = 0;
                    this.forRequest.searchText = '';
                    
                }
            }
        }); 
        $('.set-cats').css('max-height', () => {
            return +$(window).height()-220;
        } );
        $('.set-cats').css('overflow-y', 'scroll');
        

        $('input[type="checkbox"]').on('change', async (e) => {  // обработчик галочек
            const buttonId = e.target.id.replace(/[. /:?*+^$[\]\\(){}|-]/g, '_');
            const labelChar = `
                <div id='label-${buttonId}' class="label-find-char">
                    <div id="title-find-char" class="title-find-char">${this, e.target.id}</div>
                    <button id="remove-${buttonId}" class="remove-find-char">x</button>
                </div> `;

             

            if (e.target.checked === false) {
                let indxDel;
                if (e.target.parentNode.id === 'cats-block') {
                    indxDel = this.forRequest.characteristics.findIndex(v => {
                        return v === e.target.id;
                    });
                    if (indxDel >= 0) {
                        delete this.forRequest.characteristics[indxDel];
                    }
                } else if (e.target.parentNode.id === 'brands-block') {
                    indxDel = this.forRequest.brands.findIndex(v => {
                        return v === e.target.id;
                    });
                    if (indxDel >= 0) {
                        delete this.forRequest.brands[indxDel];
                    }
                } 
                
                $(`#label-${buttonId}`).remove(); 

                // dyn request
                $('#cnt').remove();
                $('#content').append('<div class="Cart-Container" id="cnt"> </div>');
                this.msg('загрузка...', this.forRequest.category);

                this.forRequest.characteristics = this.forRequest.characteristics.filter(val => {return val && val.length > 0});
                this.forRequest.brands = this.forRequest.brands.filter(val => {return val && val.length > 0});

                
                const result = await this.vapee.stockMan.findByCharacteristics(this.forRequest);
                //$('#tabs').tabs( "option", "active", 10000 );
                
                if (result.length > 0) {
                    await this.makeProductTickets(result); // array div's
                } else {
                    $('#cnt').append(`<div style="width: 100%;"><p>Ничего не найдено</p></div>`);
                    $(`#total-prods`).text('Найдено: 0');
                    $('.finded-characteristics').css('margin-top', '40px');
                    $('#alert-message').remove(); // убрать окно загрузки
                }

            } else {
                $(`#finded-characteristics`).append(labelChar);
                if (e.target.parentNode.id === 'cats-block') {
                    this.forRequest.characteristics.push(e.target.id);
                } else if (e.target.parentNode.id === 'brands-block') {
                    this.forRequest.brands.push(e.target.id);
                }
                // dyn request
                $('#cnt').remove();
                $('#content').append('<div class="Cart-Container" id="cnt"> </div>'); 
                this.msg('загрузка...', this.forRequest.category);

                this.forRequest.characteristics = this.forRequest.characteristics.filter(val => {return val && val.length > 0});
                this.forRequest.brands = this.forRequest.brands.filter(val => {return val && val.length > 0});
                const result = await this.vapee.stockMan.findByCharacteristics(this.forRequest);
                
                // $('#tabs').tabs( "option", "active", 10000 );
                
                if (result.length > 0) {
                    await this.makeProductTickets(result); // array div's
                } else {
                    $('#cnt').append(`<div style="width: 100%;"><p>Ничего не найдено</p></div>`);
                    $(`#total-prods`).text('Найдено: 0');
                    $('.finded-characteristics').css('margin-top', '40px');
                    $('#alert-message').remove(); // убрать окно загрузки
                }
                
            }

            $(`#remove-${buttonId}`).on('click', async (evn) => {  // обработчик удаления метки хар-ки
                e.target.checked = false;
                $(`#label-${buttonId}`).remove();
                let indxDel;
                if (e.target.parentNode.id === 'cats-block') {
                    indxDel = this.forRequest.characteristics.findIndex(v => {
                        return v === e.target.id;
                    });
                    if (indxDel >= 0) {
                        delete this.forRequest.characteristics[indxDel];
                    }
                } else if (e.target.parentNode.id === 'brands-block') {
                    indxDel = this.forRequest.brands.findIndex(v => {
                        return v === e.target.id;
                    });
                    if (indxDel >= 0) {
                        delete this.forRequest.brands[indxDel];
                    }
                }
                // dyn request
                $('#cnt').remove();
                $('#content').append('<div class="Cart-Container" id="cnt"> </div>');
                this.msg('загрузка...', this.forRequest.category);

                this.forRequest.characteristics = this.forRequest.characteristics.filter(val => {return val && val.length > 0});
                this.forRequest.brands = this.forRequest.brands.filter(val => {return val && val.length > 0});
                const result = await this.vapee.stockMan.findByCharacteristics(this.forRequest);
                //$('#tabs').tabs( "option", "active", 10000 );
                
                if (result.length > 0) {
                    await this.makeProductTickets(result); // array div's
                } else {
                    $('#cnt').append(`<div style="width: 100%;"><p>Ничего не найдено</p></div>`);
                    $(`#total-prods`).text('Найдено: 0');
                    $('.finded-characteristics').css('margin-top', '40px');
                    $('#alert-message').remove(); // убрать окно загрузки
                }
            });
        });

        for (let v of sortCats) {
            const id = v.replace(/[. /:?*+^$[\]\\(){}|-]/g, '_');

           $(`#submit-${id}`).on('click', async () => {  // action_on_click_button
                const idform = 'form-' + id;
                const elemsForm = document.forms[idform].elements[id];
                
                // const inputField = document.getElementById(`setText-${id}`);
                // const validText = /^[0-9a-zа-яё :]+$/i.test(inputField.value);
                // (validText) ? this.forRequest.searchText = inputField.value : inputField.value = 'Не валидный текст';
                // $('#select-cats').text(`Выбрано характеристик: ${forRequest.characteristics.length}`)
                // $('#list-cats').text(forRequest.characteristics.join(' & '));

                $('#cnt').remove();
                $('#content').append('<div class="Cart-Container" id="cnt"> </div>');
                this.msg('загрузка...', this.forRequest.category);

                this.forRequest.characteristics = this.forRequest.characteristics.filter(val => {return val && val.length > 0});
                this.forRequest.brands = this.forRequest.brands.filter(val => {return val && val.length > 0});
            
                const result = await this.vapee.stockMan.findByCharacteristics(this.forRequest);
                $('#tabs').tabs( "option", "active", 10000 );
                
                if (result.length > 0) {
                    await this.makeProductTickets(result); // array div's
                } else {
                    $('#cnt').append(`<div style="width: 100%;"><p>Ничего не найдено</p></div>`);
                    $(`#total-prods`).text('Найдено: 0');
                    $('.finded-characteristics').css('margin-top', '40px');
                    $('#alert-message').remove(); // убрать окно загрузки
                }
                
            }); // end_action_on_click_button
        }
         
        
    }

    // показать окно загрузки
    msg(title, message) {
        const msg =  $(`
            <div id="alert-message" class="message">
            <div class="wrap-msg">
                <div class="wrap-msg-title">
                    <p class="alert-msg">${title}</p>
                </div>
                <div class="wrap-msg-message"><p>${message}</p></div>
                <div class="wrap-load-img"><img src="load-img.gif" alt=""></div>
            </div>
        </div>
        `);

        $('#cnt').append(msg);
    };

    

    /**
     * Создать карточки html и вставить на страницу
     * @param {Array} arrObjs 
     */
    async makeProductTickets(arrObjs) {
        $(`#total-prods`).text(`Найдено: ${arrObjs.length}`);
        $('.finded-characteristics').css('margin-top', '0');
        for (let v of arrObjs) {
            const vprice = this.getPriceMap(v);
            let htmlPrice = '';
            if (vprice.length > 0) {
                for (let [name, price] of vprice) {
                htmlPrice += `<p class='subtitle'> <span class="from">${name} </span><span class="summa"> ${price}</span></p>`;
                }
            }
            // console.log(v)
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
                            <div class="ceni">${htmlPrice}</div>
                        </div>
                        <div  class='counter'>
                            <div id='minus_${vid}' class='btn'>-</div>
                            <div id='count_${vid}' class='count'>0</div>
                            <div id=plus_${vid} class='btn btn-plus'>+</div>
                        </div>
                        <div class='about'>
                            <p class='title'>${v['наименование'] || ''}</p>
                            <p class="title">В наличии:</p>
                            <p class="subtitle">${count_on_stock}</p>
                            <p class="subtitle, subtitle-chars">${v['характеристики']}</p>
                        </div>
                        
                    </div>
                </div>
            `);
            
            $('#cnt').append(ticket);
            $('#cnt').on("click", (e) => {
                $('#tabs').tabs( "option", "active", 10 );
            });
            (async (id, onStock)=>{
                
                $( `#plus_${id}` ).on( "click", async (e) => {
                    let currCnt = $(`#count_${id}`).text();
                    currCnt = ((+currCnt >= 0) && (+currCnt < onStock)) ? (+currCnt) + 1 : currCnt;
                    $(`#count_${id}`).text(''+currCnt);
                    const userId = this.vapee.userId;
                    const response = await this.vapee.basketMan.addProduct(userId, id);
                    
                    if (Array.isArray(response)) {
                        $('#count-basket').text(`кол-во позиций: ${response.length}`);
                        let total = response.reduce((pv, cv) => {
                            return pv + (+cv.count_on_order);
                        }, 0);
                        $('#total').text(`всего товаров: ${total}`);
                    } else {
                        this.clearContent(response);
                    } 
                });


                $( `#minus_${id}` ).on( "click", async (e) => {
                    let currCnt = $(`#count_${id}`).text();
                    currCnt = (+currCnt > 0) ? (+currCnt) - 1 : currCnt;
                    $(`#count_${id}`).text(''+currCnt);
                    const userId = this.vapee.userId;
                    const response = await this.vapee.basketMan.removeProduct(userId, id);

                    if (Array.isArray(response)) {
                        $('#count-basket').text(`кол-во позиций: ${response.length}`);
                        let total = response.reduce((pv, cv) => {
                            return pv + (+cv.count_on_order);
                        }, 0);
                        $('#total').text(`всего товаров: ${total}`);
                    } else {
                        this.clearContent(response);
                    }
                });
                
                
            })(vid, count_on_stock);
    
        }
        $('#alert-message').remove(); // убрать окно загрузки
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