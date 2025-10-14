document.addEventListener('DOMContentLoaded', () => {
    const beerStyleRollEl = document.getElementById('beer-style-roll');
    const rerollBeerBtn = document.getElementById('reroll-beer');
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

    function setBeerStyle() {
        const beerStyles = data.beer_styles;
        const mainStyleKey = getRandomKey(beerStyles);
        const mainStyle = beerStyles[mainStyleKey];
        
        const categoryKey = getRandomKey(mainStyle.categories);
        const category = mainStyle.categories[categoryKey];
        
        const beer = category[Math.floor(Math.random() * category.length)];

        const mainStyleName = mainStyleKey.charAt(0).toUpperCase() + mainStyleKey.slice(1);
        const categoryName = categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());


        beerStyleRollEl.textContent = `${mainStyleName} -> ${categoryName} -> ${beer}`;
    }

    function randomizeAll() {
        setBeerStyle();
    }

    rerollBeerBtn.addEventListener('click', setBeerStyle);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
