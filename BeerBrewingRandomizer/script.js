document.addEventListener('DOMContentLoaded', () => {
    const beerStyleRollEl = document.getElementById('beer-style-roll');
    const rerollBeerBtn = document.getElementById('reroll-beer');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data = {};
    const STORAGE_KEY = 'beerBrewingOptions';
    let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
        });

    function getRandomKey(obj) {
        const keys = Object.keys(obj);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { options = JSON.parse(saved); }
            catch (e) { options = {}; }
        }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function setBeerStyle() {
        const beerStyles = data.beer_styles;
        const mainStyleKey = getRandomKey(beerStyles);
        const mainStyle = beerStyles[mainStyleKey];
        
        const categoryKey = getRandomKey(mainStyle.categories);
        const category = mainStyle.categories[categoryKey];
        
        const beerObj = category[Math.floor(Math.random() * category.length)];

        const mainStyleName = mainStyleKey.charAt(0).toUpperCase() + mainStyleKey.slice(1);
        const categoryName = categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        beerStyleRollEl.innerHTML = `${mainStyleName} -> ${categoryName} -> <a href="${beerObj.info_url}" target="_blank" rel="noopener noreferrer">${beerObj.name}</a>`;
    }

    function randomizeAll() {
        setBeerStyle();
    }

    rerollBeerBtn.addEventListener('click', setBeerStyle);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
