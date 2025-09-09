document.addEventListener('DOMContentLoaded', () => {
    const pactEl = document.getElementById('pact');
    const armorEl = document.getElementById('armor');
    const primaryEl = document.getElementById('primary');
    const secondaryEl = document.getElementById('secondary');

    const pactLink = document.getElementById('pact-link');
    const armorLink = document.getElementById('armor-link');
    const primaryLink = document.getElementById('primary-link');
    const secondaryLink = document.getElementById('secondary-link');

    const rerollPactBtn = document.getElementById('reroll-pact');
    const rerollArmorBtn = document.getElementById('reroll-armor');
    const rerollPrimaryBtn = document.getElementById('reroll-primary');
    const rerollSecondaryBtn = document.getElementById('reroll-secondary');
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

    function setItem(element, linkElement, category) {
        const item = getRandomItem(category);
        element.textContent = item.name;
        linkElement.href = item.link;
    }

    function randomizeAll() {
        setItem(pactEl, pactLink, 'Pact');
        setItem(armorEl, armorLink, 'Armor');
        setItem(primaryEl, primaryLink, 'Primary');
        setItem(secondaryEl, secondaryLink, 'Secondary');
    }

    rerollPactBtn.addEventListener('click', () => setItem(pactEl, pactLink, 'Pact'));
    rerollArmorBtn.addEventListener('click', () => setItem(armorEl, armorLink, 'Armor'));
    rerollPrimaryBtn.addEventListener('click', () => setItem(primaryEl, primaryLink, 'Primary'));
    rerollSecondaryBtn.addEventListener('click', () => setItem(secondaryEl, secondaryLink, 'Secondary'));
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});