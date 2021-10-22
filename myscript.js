let globalDataSource = [];
let filteredDataSource = [];
let globalFilters = {
    sortPrice:null,
    sortPopularity:null,
    discounts:[],
    categories:[],
    minPrice: null,
    maxPrice: null
};

const dataContainer = document.getElementById('container3');

const load = () => {
    const xhr = new XMLHttpRequest();

    if (!xhr) {
        alert('Couldn\'t create XHR Object');
        return false;
    }

    xhr.onreadystatechange = renderContent;
    xhr.open('GET','phones.json');
    xhr.send();

    function renderContent() {
        if (xhr.readyState === 4) {
            console.log('Received the data');

            if (xhr.status === 200) {
                globalDataSource = JSON.parse(xhr.responseText).phones;
                filteredDataSource = [...globalDataSource];
                createList();
            } else {
                console.error('Problem making AJAX request');
            }
        }
    };
}
window.onload=load;

const applyFilters = () => {
   filteredDataSource = [...globalDataSource];
   const {sortPrice,sortPopularity,discounts,categories,minPrice,maxPrice} = globalFilters
   sortData(sortPrice,"price")
   sortData(sortPopularity,"Popularity")
   filterDiscounts(discounts)
   sortCategory(categories)
   filterPrices(minPrice,maxPrice)
   createList()
}

const createList = () =>{
    if (filteredDataSource) {
        dataContainer.innerHTML = "";
        for (const { title, price, category, logo} of filteredDataSource) {
            const dataCard = dataContainer.appendChild(document.createElement('div'));
            dataCard.className='data-card';
            dataCard.innerHTML=(`<img src="${logo}"> <p>${title}</p> <p>₹ ${price}</p> <p>${category}</p> <button>PLAY</button>`)                   
        } 
    }
    else{
        console.error('Problem in processing request');
    }
}


const sortData = (order,key) => {
    if(!order){ return ; }
    const multiplyFactor = order === "ascending" ? 1:-1;
    filteredDataSource.sort((a, b) => (a[key]-b[key]) * multiplyFactor);
}

const sortCategory = categories => {
    if(categories.length){
        filteredDataSource = filteredDataSource.filter(element => categories.includes(element.category));
    }
}

const filterDiscounts = discounts => {
    if(discounts.length)
    {
       filteredDataSource = filteredDataSource.filter(element => discounts.includes(element.discount));
    } 
}

const filterPrices = (minPrice,maxPrice) => {
    if(minPrice && maxPrice)
    {
       filteredDataSource = filteredDataSource.filter(element => element.price >= minPrice && element.price <= maxPrice);
    } 
}


const reset = () => {
    filteredDataSource = [...globalDataSource];
        globalFilters = {
        sortPrice:null,
        sortPopularity:null,
        discounts:[],
        categories:[],
        minPrice:null,
        maxPrice:null
       };
    applyFilters()
}

const handleFilters = (filter,type) => {
    if(type==="discounts"){
       let discounts = globalFilters.discounts 
       if(discounts.includes(filter)){
         console.log(discounts)
         discounts=discounts.filter(element => element !== filter)
         console.log(discounts)
       } 
       else{
           discounts.push(filter)
       } 
       globalFilters.discounts = discounts
    }
    else if(type==="categories"){
        let categories = globalFilters.categories 
        if(categories.includes(filter)){
          categories=categories.filter(element => element !== filter)
        } 
        else{
            categories.push(filter)
        } 
        globalFilters.categories = categories
    }
    else if(type==="minPrice" || type==="maxPrice" ){
       globalFilters[type] = parseInt(filter)
    }
    else{
        globalFilters.sortPopularity = null
        globalFilters.sortPrice = null
        globalFilters[type] = filter
    }
    applyFilters()
}

