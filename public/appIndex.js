


async function getDataPage() {
    const data = await axios.post('/assort');
    const alls = data.data;
    if (Object.keys(alls).length === 2 ) {
        console.log(alls.allProducts)
       return [alls.paramId, alls.allProducts]
    } else {
        return [null, null];
    }
}
getDataPage();
/**
 * 
 * @param {Array} keys 
 * @param {Array} arrObjs 
 */
async function getConcreteData(arrObjs) {
    const divs = [];

    arrObjs.forEach((v, i) => {
        const ticket = $("<div class='ticket'></div>");
        const imgAreaTicket = $("<div class='img-area-ticket'></div>");
        const dataAreaTicket = $("<div class='data-area-ticket'>");
        const tasteAreaTicket = $("<div class='taste-area-ticket'>");
        const priceAreaTicket = $("<div class='price-area-ticket'>");

        const img = `<a href="#"><img src="${v.photo}"/></a>`;
        imgAreaTicket.append(img);

        const brand = v.brand || '';
        const name_taste = v.name_taste || '';
        const price_from_1to2 = v.price_from_1to2 || '';
        const price_from_3to4 = v.price_from_3to4 || '';
        const price_from_5to9 = v.price_from_5to9 || '';
        const price_from_10to29 = v.price_from_10to29 || '';
        const price_from_30to69 = v.price_from_30to69 || '';
        const price_from_70to149 = v.price_from_70to149 || '';
        const price_from_150 = v.price_from_150 || '';

        dataAreaTicket.append(`<p>Бренд:</p> <p>${brand}</p>`);
        tasteAreaTicket.append(`<p>Вкус:</p> <p>${name_taste}</p>`);

        priceAreaTicket.append(`<span>Цена от 1 до 2: ${price_from_1to2}</span>`);
        priceAreaTicket.append(`<span>Цена от 3 до 4: ${price_from_3to4}</span>`);
        priceAreaTicket.append(`<span>Цена от 5 до 9: ${price_from_5to9}</span>`);
        priceAreaTicket.append(`<span>Цена от 10 до 29: ${price_from_10to29}</span>`);
        priceAreaTicket.append(`<span>Цена от 30 до 69: ${price_from_30to69}</span>`);
        priceAreaTicket.append(`<span>Цена от 70 до 149: ${price_from_70to149}</span>`);
        priceAreaTicket.append(`<span>Цена от 150: ${price_from_150}</span>`);

        ticket.append(imgAreaTicket);
        ticket.append(dataAreaTicket);
        ticket.append(tasteAreaTicket);
        ticket.append(priceAreaTicket);

        divs.push(ticket);
    });

    return divs;
} 

async function createTable() {
    const [usid, allData] = await getDataPage()
    if (!usid || !allData) 
        console.log('Empty data from server.')
    console.log(usid, allData);
    $('#usid').text(`Твой telegram id = ${usid}`);

    
    // const table = $('<table>');
    // cell = `<a class="img-products" href="#"><img src="${v}"/></a>`
    // const headerRow = $('<tr>');
    // const nameRows = ['фото', 'бренд', 'характеристика', 'имя товара', 'имя вкуса', 'цены'];
    const keys = [
            'photo',
            'brand',
            'name_taste',
            'price_from_1to2',
            'price_from_3to4',
            'price_from_5to9',
            'price_from_10to29',
            'price_from_30to69',
            'price_from_70to149',
            'price_from_150'
        ];
    const namesFrom = [
            'от 1 до 2', 'от 3 до 4', 'от 5 до 9', 'от 10 до 29', 'от 30 до 69',
            'от 70 до 149', 'от 150'  
    ];
    const entityData = await getConcreteData(allData); // array div's
    
    for (let entity of entityData) {
        $('#cnt').append(entity);
    }
    
    
}


// createTable();

 