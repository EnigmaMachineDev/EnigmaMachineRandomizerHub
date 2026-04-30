document.addEventListener('DOMContentLoaded', () => {
    const meatRollEl = document.getElementById('meat-roll');
    const vegetableRollEl = document.getElementById('vegetable-roll');
    const beanRollEl = document.getElementById('bean-roll');
    const grainRollEl = document.getElementById('grain-roll');
    const fruitRollEl = document.getElementById('fruit-roll');
    const sauceRollEl = document.getElementById('sauce-roll');

    const rerollMeatBtn = document.getElementById('reroll-meat');
    const rerollVegetableBtn = document.getElementById('reroll-vegetable');
    const rerollBeanBtn = document.getElementById('reroll-bean');
    const rerollGrainBtn = document.getElementById('reroll-grain');
    const rerollFruitBtn = document.getElementById('reroll-fruit');
    const rerollSauceBtn = document.getElementById('reroll-sauce');
    const generatePrepBtn = document.getElementById('generate-prep');

    let data = {};
    const STORAGE_KEY = 'ingredientPrepOptions';
    let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
        });

    // Pick N unique random items from an array
    function getUniqueRandomItems(arr, count) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, arr.length));
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { options = JSON.parse(saved); }
            catch (e) { options = {}; }
        }
    }

    function isEnabled(sectionName, itemName) {
        if (!options[sectionName]) return true;
        if (!options[sectionName].hasOwnProperty(itemName)) return true;
        return options[sectionName][itemName];
    }

    function getEnabledOptions(sectionName) {
        const section = data.sections?.find(s => s.name === sectionName);
        if (!section || !section.options) return [];
        return section.options.filter(opt => isEnabled(sectionName, opt));
    }

    function getPickCount(sectionName) {
        const section = data.sections?.find(s => s.name === sectionName);
        return section?.pick || 1;
    }

    // Render one or multiple items into a container element
    function renderItems(rollEl, items) {
        rollEl.innerHTML = '';
        if (items.length === 1) {
            rollEl.textContent = items[0];
        } else {
            const ul = document.createElement('ul');
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            rollEl.appendChild(ul);
        }
    }

    function setSection(sectionName, rollEl) {
        const enabledItems = getEnabledOptions(sectionName);
        if (enabledItems.length === 0) {
            rollEl.textContent = `No ${sectionName.toLowerCase()} options enabled`;
            return;
        }
        const pickCount = getPickCount(sectionName);
        const picked = getUniqueRandomItems(enabledItems, pickCount);
        renderItems(rollEl, picked);
    }

    function randomizeAll() {
        setSection('Meat', meatRollEl);
        setSection('Vegetable', vegetableRollEl);
        setSection('Bean/Legume', beanRollEl);
        setSection('Grain', grainRollEl);
        setSection('Fruit', fruitRollEl);
        setSection('Sauce/Marinade', sauceRollEl);
    }

    rerollMeatBtn.addEventListener('click', () => setSection('Meat', meatRollEl));
    rerollVegetableBtn.addEventListener('click', () => setSection('Vegetable', vegetableRollEl));
    rerollBeanBtn.addEventListener('click', () => setSection('Bean/Legume', beanRollEl));
    rerollGrainBtn.addEventListener('click', () => setSection('Grain', grainRollEl));
    rerollFruitBtn.addEventListener('click', () => setSection('Fruit', fruitRollEl));
    rerollSauceBtn.addEventListener('click', () => setSection('Sauce/Marinade', sauceRollEl));
    generatePrepBtn.addEventListener('click', randomizeAll);

    function copyResults() {
        const sections = document.querySelectorAll('.container > .section');
        const lines = [];
        sections.forEach(section => {
            const header = section.querySelector('.section-header h2');
            if (!header) return;
            // Clone to extract label text without pick-count span
            const headerClone = header.cloneNode(true);
            const pickCountEl = headerClone.querySelector('.pick-count');
            if (pickCountEl) pickCountEl.remove();
            const label = headerClone.textContent.trim();
            const itemContainer = section.querySelector('.item-container');
            if (!itemContainer) return;
            const listItems = itemContainer.querySelectorAll('li');
            let value = '';
            if (listItems.length > 0) {
                value = Array.from(listItems).map(li => li.textContent.trim()).join(', ');
            } else {
                value = itemContainer.textContent.trim();
            }
            if (value) lines.push(label + ': ' + value);
        });
        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-results');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
    }

    document.getElementById('copy-results').addEventListener('click', copyResults);
});
