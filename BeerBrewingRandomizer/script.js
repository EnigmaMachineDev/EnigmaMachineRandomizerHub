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
        })
        .catch(error => {
            console.error('Error loading data:', error);
            beerStyleRollEl.textContent = 'Error loading beer data';
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

    function getEnabledItems(category) {
        if (!data[category]) return [];
        return data[category].filter(item => isEnabled(category, item.name));
    }

    function setBeerStyle() {
        const beerStyles = data.beer_styles;
        if (!beerStyles) {
            beerStyleRollEl.textContent = 'No beer styles available';
            return;
        }
        
        // Collect all enabled beers from all categories
        const allEnabledBeers = [];
        Object.keys(beerStyles).forEach(mainStyleKey => {
            const mainStyle = beerStyles[mainStyleKey];
            Object.keys(mainStyle.categories).forEach(categoryKey => {
                const categoryData = mainStyle.categories[categoryKey];
                const enabledBeers = categoryData.filter(beer => isEnabled(categoryKey, beer.name));
                enabledBeers.forEach(beer => {
                    allEnabledBeers.push({
                        beer: beer,
                        mainStyleKey: mainStyleKey,
                        categoryKey: categoryKey
                    });
                });
            });
        });
        
        if (allEnabledBeers.length === 0) {
            beerStyleRollEl.textContent = 'No beers selected';
            return;
        }
        
        // Pick a random enabled beer
        const selected = allEnabledBeers[Math.floor(Math.random() * allEnabledBeers.length)];
        const mainStyleName = selected.mainStyleKey.charAt(0).toUpperCase() + selected.mainStyleKey.slice(1);
        const categoryName = selected.categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        beerStyleRollEl.innerHTML = `${mainStyleName} -> ${categoryName} -> <a href="${selected.beer.info_url}" target="_blank" rel="noopener noreferrer">${selected.beer.name}</a>`;
    }

    function randomizeAll() {
        setBeerStyle();
    }

    rerollBeerBtn.addEventListener('click', setBeerStyle);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
