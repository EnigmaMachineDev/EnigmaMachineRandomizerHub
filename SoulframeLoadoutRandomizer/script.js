document.addEventListener('DOMContentLoaded', () => {
    const prismEl = document.getElementById('prism');
    const prismVirtuesEl = document.getElementById('prism-virtues');
    const pactEl = document.getElementById('pact');
    const helmEl = document.getElementById('helm');
    const cuirassEl = document.getElementById('cuirass');
    const leggingsEl = document.getElementById('leggings');
    const primaryEl = document.getElementById('primary');
    const secondaryEl = document.getElementById('secondary');
    const color1El = document.getElementById('color1');
    const color2El = document.getElementById('color2');
    const color3El = document.getElementById('color3');

    const pactLink = document.getElementById('pact-link');
    const helmLink = document.getElementById('helm-link');
    const cuirassLink = document.getElementById('cuirass-link');
    const leggingsLink = document.getElementById('leggings-link');
    const primaryLink = document.getElementById('primary-link');
    const secondaryLink = document.getElementById('secondary-link');
    const color1Link = document.getElementById('color1-link');
    const color2Link = document.getElementById('color2-link');
    const color3Link = document.getElementById('color3-link');

    const rerollPrismBtn = document.getElementById('reroll-prism');
    const rerollPactBtn = document.getElementById('reroll-pact');
    const rerollArmorBtn = document.getElementById('reroll-armor');
    const rerollPrimaryBtn = document.getElementById('reroll-primary');
    const rerollSecondaryBtn = document.getElementById('reroll-secondary');
    const rerollColorsBtn = document.getElementById('reroll-colors');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data = {};
    const STORAGE_KEY = 'soulframeOptions';
    let options = {};
    let currentPrism = null;

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) { try { options = JSON.parse(saved); } catch (e) {} }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function getEnabledItems(category, virtueFilter) {
        if (!data[category]) return [];
        return data[category].filter(item => {
            if (!isEnabled(category, item.name)) return false;
            if (virtueFilter && item.virtues) {
                if (item.virtues.includes('PLACEHOLDER')) return true;
                return item.virtues.every(v => virtueFilter.includes(v));
            }
            return true;
        });
    }

    function getCurrentVirtues() {
        return currentPrism ? currentPrism.virtues : null;
    }

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
        });

    function rollPrism() {
        const items = getEnabledItems('Prism');
        currentPrism = getRandomValue(items);
        if (currentPrism) {
            prismEl.textContent = currentPrism.name;
            prismVirtuesEl.textContent = '(' + currentPrism.virtues.join(' / ') + ')';
        }
    }

    function setItem(element, linkElement, category) {
        const virtueFilter = getCurrentVirtues();
        const items = getEnabledItems(category, virtueFilter);
        const item = getRandomValue(items);
        if (item) {
            element.textContent = item.name;
            if (linkElement && item.link) linkElement.href = item.link;
        }
    }

    function setColorItem(element, linkElement) {
        const items = getEnabledItems('Color');
        const item = getRandomValue(items);
        if (item) {
            const swatch = Math.floor(Math.random() * 4) + 1;
            element.textContent = item.name + ' - ' + swatch;
            if (linkElement && item.link) linkElement.href = item.link;
        }
    }

    function rollVirtueDependentCategories() {
        setItem(helmEl, helmLink, 'Helm');
        setItem(cuirassEl, cuirassLink, 'Cuirass');
        setItem(leggingsEl, leggingsLink, 'Leggings');
        setItem(primaryEl, primaryLink, 'Primary');
        setItem(secondaryEl, secondaryLink, 'Secondary');
    }

    function randomizeAll() {
        rollPrism();
        setItem(pactEl, pactLink, 'Pact');
        rollVirtueDependentCategories();
        setColorItem(color1El, color1Link);
        setColorItem(color2El, color2Link);
        setColorItem(color3El, color3Link);
    }

    rerollPrismBtn.addEventListener('click', () => {
        rollPrism();
        rollVirtueDependentCategories();
    });
    rerollPactBtn.addEventListener('click', () => setItem(pactEl, pactLink, 'Pact'));
    rerollArmorBtn.addEventListener('click', () => {
        setItem(helmEl, helmLink, 'Helm');
        setItem(cuirassEl, cuirassLink, 'Cuirass');
        setItem(leggingsEl, leggingsLink, 'Leggings');
    });
    rerollPrimaryBtn.addEventListener('click', () => setItem(primaryEl, primaryLink, 'Primary'));
    rerollSecondaryBtn.addEventListener('click', () => setItem(secondaryEl, secondaryLink, 'Secondary'));
    rerollColorsBtn.addEventListener('click', () => {
        setColorItem(color1El, color1Link);
        setColorItem(color2El, color2Link);
        setColorItem(color3El, color3Link);
    });
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});