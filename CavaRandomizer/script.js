document.addEventListener('DOMContentLoaded', () => {
    let data = {};
    let options = {};
    let STORAGE_KEY = 'restaurantOptions';

    fetch('randomizer.json')
        .then(res => res.json())
        .then(jsonData => {
            data = jsonData;
            STORAGE_KEY = data.storageKey || 'restaurantOptions';
            loadOptions();
            buildUI();
            randomizeAll();
        });

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

    function getEnabledItems(section) {
        return section.items.filter(item => isEnabled(section.name, item));
    }

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomUnique(arr, count) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, arr.length));
    }

    function buildUI() {
        const badge = document.getElementById('restaurant-badge');
        if (badge && data.restaurant) {
            badge.textContent = (data.emoji || '🍽️') + ' ' + data.restaurant + (data.location ? ' – ' + data.location : '');
        }

        const container = document.getElementById('sections-container');
        container.innerHTML = '';

        data.sections.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section';

            const header = document.createElement('div');
            header.className = 'section-header';

            const h2 = document.createElement('h2');
            h2.textContent = section.name;
            if (section.pickCount > 1) {
                const note = document.createElement('span');
                note.className = 'step-note';
                note.textContent = ' (' + section.pickCount + ' picks)';
                h2.appendChild(note);
            }

            const rerollBtn = document.createElement('button');
            rerollBtn.className = 'reroll-btn';
            rerollBtn.textContent = '↻';
            rerollBtn.title = 'Re-roll ' + section.name;
            rerollBtn.addEventListener('click', () => randomizeSection(index));

            header.appendChild(h2);
            header.appendChild(rerollBtn);

            const itemContainer = document.createElement('div');
            itemContainer.className = 'item-container';
            itemContainer.id = 'section-' + index + '-roll';

            sectionDiv.appendChild(header);
            sectionDiv.appendChild(itemContainer);
            container.appendChild(sectionDiv);
        });
    }

    function randomizeSection(index) {
        const section = data.sections[index];
        const el = document.getElementById('section-' + index + '-roll');
        const enabled = getEnabledItems(section);

        if (enabled.length === 0) {
            el.innerHTML = '';
            const p = document.createElement('p');
            p.className = 'result-empty';
            p.textContent = 'No ' + section.name.toLowerCase() + ' enabled. Configure options.';
            el.appendChild(p);
            return;
        }

        const pickCount = section.pickCount || 1;
        el.innerHTML = '';

        if (pickCount === 1) {
            const span = document.createElement('span');
            span.className = 'result-single';
            span.textContent = getRandomValue(enabled);
            el.appendChild(span);
        } else {
            const picks = getRandomUnique(enabled, pickCount);
            const ul = document.createElement('ul');
            ul.className = 'result-list';
            picks.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            el.appendChild(ul);
        }
    }

    function randomizeAll() {
        data.sections.forEach((_, index) => randomizeSection(index));
    }

    document.getElementById('generate-btn').addEventListener('click', randomizeAll);

    document.getElementById('copy-results').addEventListener('click', () => {
        const lines = [];
        data.sections.forEach((section, index) => {
            const el = document.getElementById('section-' + index + '-roll');
            const single = el.querySelector('.result-single');
            if (single) {
                lines.push(section.name + ': ' + single.textContent.trim());
                return;
            }
            const items = el.querySelectorAll('li');
            if (items.length > 0) {
                lines.push(section.name + ': ' + Array.from(items).map(li => li.textContent.trim()).join(', '));
            }
        });
        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-results');
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 2000);
        });
    });
});
