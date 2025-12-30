document.addEventListener('DOMContentLoaded', () => {
    const beverageRollEl = document.getElementById('beverage-roll');
    const rerollBeverageBtn = document.getElementById('reroll-beverage');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data = {}; const STORAGE_KEY = 'brewingOptions'; let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions(); randomizeAll();
        });

    function getRandomKey(obj) {
        const keys = Object.keys(obj);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    function getRandomValue(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function loadOptions() { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { try { options = JSON.parse(saved); } catch (e) {} } }
    function isEnabled(category, name) { if (!options[category]) return true; if (!options[category].hasOwnProperty(name)) return true; return options[category][name]; }
    function getEnabledItems(category) { if (!data[category]) return []; return data[category].filter(item => isEnabled(category, item.name)); }

    function setBeverage() {
        // Define main beverage categories
        const categories = ['beer', 'wine', 'spirits'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        let result = '';

        if (category === 'beer') {
            // Handle beer_styles structure
            const beerStyles = data.beer_styles;
            const styleTypeKey = getRandomKey(beerStyles); // ales or lagers
            const styleType = beerStyles[styleTypeKey];
            const categories = styleType.categories;
            const categoryKey = getRandomKey(categories);
            const categoryData = categories[categoryKey];
            
            // Filter by enabled items
            const enabledBeers = categoryData.filter(beer => isEnabled(categoryKey, beer.name));
            if (enabledBeers.length === 0) {
                result = 'No beers selected in this category';
            } else {
                const beerObj = getRandomValue(enabledBeers);
                result = `Beer -> ${styleTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> ${categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> <a href="${beerObj.info_url}" target="_blank" rel="noopener noreferrer">${beerObj.name}</a>`;
            }
        } else if (category === 'wine') {
            // Handle wine types (Wines array, Fruit Wine, Mead, Sake)
            const wineCategories = getEnabledItems('Wines');
            if (wineCategories.length === 0) {
                result = 'No wine types selected';
            } else {
                const wineTypeObj = getRandomValue(wineCategories);
                const wineType = wineTypeObj.name;
                const wineData = getEnabledItems(wineType);
                if (wineData.length === 0) {
                    result = `No ${wineType} wines selected`;
                } else {
                    const wineObj = getRandomValue(wineData);
                    result = `Wine -> ${wineType} -> <a href="${wineObj.info_url}" target="_blank" rel="noopener noreferrer">${wineObj.name}</a>`;
                }
            }
        } else if (category === 'spirits') {
            // Handle spirits structure
            const spirits = data.spirits;
            const spiritTypeKey = getRandomKey(spirits);
            const spiritData = spirits[spiritTypeKey];
            
            // Filter by enabled items
            const enabledSpirits = spiritData.filter(spirit => isEnabled(spiritTypeKey, spirit.name));
            if (enabledSpirits.length === 0) {
                result = 'No spirits selected in this category';
            } else {
                const spiritObj = getRandomValue(enabledSpirits);
                result = `Spirits -> ${spiritTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> <a href="${spiritObj.info_url}" target="_blank" rel="noopener noreferrer">${spiritObj.name}</a>`;
            }
        }

        beverageRollEl.innerHTML = result;
    }

    function randomizeAll() {
        setBeverage();
    }

    rerollBeverageBtn.addEventListener('click', setBeverage);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
