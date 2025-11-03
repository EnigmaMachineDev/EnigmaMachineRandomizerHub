document.addEventListener('DOMContentLoaded', () => {
    const wineRollEl = document.getElementById('wine-roll');
    const sweetnessEl = document.getElementById('sweetness');
    const carbonationEl = document.getElementById('carbonation');
    const alcoholEl = document.getElementById('alcohol');

    const rerollWineBtn = document.getElementById('reroll-wine');
    const rerollSweetnessBtn = document.getElementById('reroll-sweetness');
    const rerollCarbonationBtn = document.getElementById('reroll-carbonation');
    const rerollAlcoholBtn = document.getElementById('reroll-alcohol');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data={};const STORAGE_KEY='homebrewingWineOptions';let options={};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();randomizeAll();
        });

    function getRandomItem(category) {
        function getRandomValue(arr){return arr[Math.floor(Math.random()*arr.length)];}
        const enabledItems = getEnabledItems(category);
        return getRandomValue(enabledItems);
    }

    function loadOptions(){const saved=localStorage.getItem(STORAGE_KEY);if(saved){try{options=JSON.parse(saved);}catch(e){}}}
    function isEnabled(category,name){if(!options[category])return true;if(!options[category].hasOwnProperty(name))return true;return options[category][name];}
    function getEnabledItems(category){if(!data[category])return[];return data[category].filter(item=>isEnabled(category,item.name));}

    function setItem(element, category) {
        const item = getRandomItem(category);
        element.textContent = item;
    }

    function setWine() {
        const wineType = getRandomItem('Wines');
        const specificWineObj = getRandomItem(wineType);
        wineRollEl.innerHTML = `${wineType}: <a href="${specificWineObj.info_url}" target="_blank" rel="noopener noreferrer">${specificWineObj.name}</a>`;
    }

    function randomizeAll() {
        setWine();
        setItem(sweetnessEl, 'Sweetness');
        setItem(carbonationEl, 'Carbonation');
        setItem(alcoholEl, 'Alcohol Content');
    }

    rerollWineBtn.addEventListener('click', setWine);
    rerollSweetnessBtn.addEventListener('click', () => setItem(sweetnessEl, 'Sweetness'));
    rerollCarbonationBtn.addEventListener('click', () => setItem(carbonationEl, 'Carbonation'));
    rerollAlcoholBtn.addEventListener('click', () => setItem(alcoholEl, 'Alcohol Content'));
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
