document.addEventListener('DOMContentLoaded', () => {
    const baseRollEl = document.getElementById('base-roll');
    const proteinsRollEl = document.getElementById('proteins-roll');
    const toppingsRollEl = document.getElementById('toppings-roll');
    const sauceRollEl = document.getElementById('sauce-roll');

    let data = {};
    const STORAGE_KEY = 'zenBowlOptions';
    let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomUnique(arr, count) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
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
        return data[category].filter(item => isEnabled(category, item));
    }

    function renderList(el, items) {
        el.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'result-list';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        el.appendChild(ul);
    }

    function renderSingle(el, item) {
        el.innerHTML = '';
        const span = document.createElement('span');
        span.className = 'result-single';
        span.textContent = item;
        el.appendChild(span);
    }

    function renderEmpty(el, message) {
        el.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'result-empty';
        p.textContent = message;
        el.appendChild(p);
    }

    function setBase() {
        const enabled = getEnabledItems('bases');
        if (enabled.length === 0) {
            renderEmpty(baseRollEl, 'No bases enabled. Please configure options.');
            return;
        }
        renderSingle(baseRollEl, getRandomValue(enabled));
    }

    function setProteins() {
        const enabled = getEnabledItems('proteins');
        if (enabled.length === 0) {
            renderEmpty(proteinsRollEl, 'No proteins enabled. Please configure options.');
            return;
        }
        const picks = getRandomUnique(enabled, 2);
        renderList(proteinsRollEl, picks);
    }

    function setToppings() {
        const enabled = getEnabledItems('toppings');
        if (enabled.length === 0) {
            renderEmpty(toppingsRollEl, 'No toppings enabled. Please configure options.');
            return;
        }
        const picks = getRandomUnique(enabled, 4);
        renderList(toppingsRollEl, picks);
    }

    function setSauce() {
        const enabled = getEnabledItems('sauces');
        if (enabled.length === 0) {
            renderEmpty(sauceRollEl, 'No sauces enabled. Please configure options.');
            return;
        }
        renderSingle(sauceRollEl, getRandomValue(enabled));
    }

    function randomizeAll() {
        setBase();
        setProteins();
        setToppings();
        setSauce();
    }

    document.getElementById('generate-bowl').addEventListener('click', randomizeAll);
    document.getElementById('reroll-base').addEventListener('click', setBase);
    document.getElementById('reroll-proteins').addEventListener('click', setProteins);
    document.getElementById('reroll-toppings').addEventListener('click', setToppings);
    document.getElementById('reroll-sauce').addEventListener('click', setSauce);

    document.getElementById('copy-results').addEventListener('click', () => {
        const lines = [];

        const baseText = baseRollEl.querySelector('.result-single');
        if (baseText) lines.push('Base: ' + baseText.textContent.trim());

        const proteinItems = proteinsRollEl.querySelectorAll('li');
        if (proteinItems.length > 0) {
            lines.push('Proteins: ' + Array.from(proteinItems).map(li => li.textContent.trim()).join(', '));
        }

        const toppingItems = toppingsRollEl.querySelectorAll('li');
        if (toppingItems.length > 0) {
            lines.push('Toppings: ' + Array.from(toppingItems).map(li => li.textContent.trim()).join(', '));
        }

        const sauceText = sauceRollEl.querySelector('.result-single');
        if (sauceText) lines.push('Sauce: ' + sauceText.textContent.trim());

        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-results');
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 2000);
        });
    });
});
