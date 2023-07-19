


async function getDataPage() {
    const data = await axios.post('/assort');
    const alls = data.data;
    if (Object.keys(alls).length === 2 ) {
       return [alls.paramId, alls.allProducts]
    } else {
        return [null, null];
    }
}
 
/**
 * 
 * @param {Array} keys 
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
        ticket = $(`
            <div class="Cart-Container" id="cnt">
            <div class="Header">
                <p class="Heading">${v.id || '##'}</p>
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
                <div class='about'>
                        <p class='title'>${v.brand || ''}</p>
                        <p class='subtitle'>${v.name_taste || ''}</p>
                        <p class="title">В наличии:</p>
                        <p class="subtitle">${v.count_on_stock || ''}</p>
                    </div>
                    <div class='counter'>
                        <div id='minus-${v.id}' class='btn'>-</div>
                        <div id='action-count' class='count'>0</div>
                        <div id='plus-${v.id}' class='btn btn-plus'>+</div>
                    </div>
                </div>
            </div>
    `);

        $('#cnt').append(ticket);
    });
} 

function getPriceMap(obj) {
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

 


 