document.addEventListener('DOMContentLoaded', () => {
    let data = {};
    let options = {};
    let STORAGE_KEY = 'restaurantPickerOptions';

    fetch('randomizer.json')
        .then(res => res.json())
        .then(jsonData => {
            data = jsonData;
            STORAGE_KEY = data.storageKey || STORAGE_KEY;
            loadOptions();
        });

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { options = JSON.parse(saved); }
            catch (e) { options = {}; }
        }
    }

    function isEnabled(name) {
        if (!options.restaurants) return true;
        if (options.restaurants[name] === undefined) return true;
        return options.restaurants[name];
    }

    function pickRandom() {
        if (!data.restaurants || data.restaurants.length === 0) return;
        const enabled = data.restaurants.filter(r => isEnabled(r.name));
        if (enabled.length === 0) {
            showEmpty();
            return;
        }
        const pick = enabled[Math.floor(Math.random() * enabled.length)];
        showResult(pick);
    }

    function showEmpty() {
        const container = document.getElementById('result-container');
        container.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'result-empty';
        p.textContent = 'No restaurants enabled. Configure options to enable some.';
        container.appendChild(p);
    }

    function showResult(pick) {
        const container = document.getElementById('result-container');
        container.innerHTML = '';

        const section = document.createElement('div');
        section.className = 'section';

        const header = document.createElement('div');
        header.className = 'section-header';
        const h2 = document.createElement('h2');
        h2.textContent = 'Your Restaurant';
        const rerollBtn = document.createElement('button');
        rerollBtn.className = 'reroll-btn';
        rerollBtn.textContent = '↻';
        rerollBtn.title = 'Pick again';
        rerollBtn.addEventListener('click', pickRandom);
        header.appendChild(h2);
        header.appendChild(rerollBtn);

        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';

        const link = document.createElement('a');
        link.href = pick.url;
        link.className = 'result-link';
        link.textContent = pick.name + ' →';

        itemContainer.appendChild(link);
        section.appendChild(header);
        section.appendChild(itemContainer);
        container.appendChild(section);
    }

    document.getElementById('generate-btn').addEventListener('click', pickRandom);
});
