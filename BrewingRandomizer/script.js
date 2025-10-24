document.addEventListener('DOMContentLoaded', () => {
    const beverageRollEl = document.getElementById('beverage-roll');
    const rerollBeverageBtn = document.getElementById('reroll-beverage');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            randomizeAll();
        });

    function getRandomKey(obj) {
        const keys = Object.keys(obj);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

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
            const beer = getRandomValue(categories[categoryKey]);
            result = `Beer -> ${styleTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> ${categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> ${beer}`;
        } else if (category === 'wine') {
            // Handle wine types (Wines array, Fruit Wine, Mead, Sake)
            const wineCategories = data.Wines;
            const wineType = getRandomValue(wineCategories);
            const wine = getRandomValue(data[wineType]);
            result = `Wine -> ${wineType} -> ${wine}`;
        } else if (category === 'spirits') {
            // Handle spirits structure
            const spirits = data.spirits;
            const spiritTypeKey = getRandomKey(spirits);
            const spirit = getRandomValue(spirits[spiritTypeKey]);
            result = `Spirits -> ${spiritTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> ${spirit}`;
        }

        beverageRollEl.textContent = result;
    }

    function randomizeAll() {
        setBeverage();
    }

    rerollBeverageBtn.addEventListener('click', setBeverage);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
