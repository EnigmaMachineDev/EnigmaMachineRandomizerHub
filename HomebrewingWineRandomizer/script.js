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

    let data = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            randomizeAll();
        });

    function getRandomItem(category) {
        const items = data[category];
        return items[Math.floor(Math.random() * items.length)];
    }

    function setItem(element, category) {
        const item = getRandomItem(category);
        element.textContent = item;
    }

    function setWine() {
        const wineType = getRandomItem('Wines');
        const specificWine = getRandomItem(wineType);
        wineRollEl.textContent = `${wineType}: ${specificWine}`;
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
