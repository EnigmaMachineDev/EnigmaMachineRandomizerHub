document.addEventListener('DOMContentLoaded', () => {
    const mapEl = document.getElementById('map');
    const mapLinkEl = document.getElementById('map-link');
    const weaponClassEl = document.getElementById('weapon-class');
    const weaponClassLinkEl = document.getElementById('weapon-class-link');
    const augmentTypeEl = document.getElementById('augment-type');
    const augmentTypeLinkEl = document.getElementById('augment-type-link');
    const shieldEl = document.getElementById('shield');
    const shieldLinkEl = document.getElementById('shield-link');
    const grenadesListEl = document.getElementById('grenades-list');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollMapBtn = document.getElementById('reroll-map');
    const rerollWeaponClassBtn = document.getElementById('reroll-weapon-class');
    const rerollAugmentTypeBtn = document.getElementById('reroll-augment-type');
    const rerollShieldBtn = document.getElementById('reroll-shield');
    const rerollGrenadesBtn = document.getElementById('reroll-grenades');

    let data = {};
    const STORAGE_KEY = 'arcRaidersOptions';
    let options = {};

    function getRandomItem(items) {
        if (!items || items.length === 0) return null;
        return items[Math.floor(Math.random() * items.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) {}
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

    function setItem(el, linkEl, item) {
        if (!item) {
            el.textContent = 'N/A';
            linkEl.href = '#';
            return;
        }
        el.textContent = item.name;
        if (item.link) {
            linkEl.href = item.link;
        } else {
            linkEl.href = '#';
        }
    }

    function rollMap() {
        const items = getEnabledItems('Maps');
        setItem(mapEl, mapLinkEl, getRandomItem(items));
    }

    function rollWeaponClass() {
        const items = getEnabledItems('Weapon Class');
        setItem(weaponClassEl, weaponClassLinkEl, getRandomItem(items));
    }

    function rollAugmentType() {
        const items = getEnabledItems('Augment Type');
        setItem(augmentTypeEl, augmentTypeLinkEl, getRandomItem(items));
    }

    function rollShield() {
        const items = getEnabledItems('Shields');
        setItem(shieldEl, shieldLinkEl, getRandomItem(items));
    }

    function rollGrenades() {
        const items = getEnabledItems('Grenades');
        if (!items || items.length === 0) {
            grenadesListEl.innerHTML = '<li>N/A</li>';
            return;
        }
        const count = Math.min(Math.floor(Math.random() * 3) + 1, items.length);
        const selected = [];
        const pool = [...items];
        for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * pool.length);
            selected.push(pool.splice(idx, 1)[0]);
        }
        grenadesListEl.innerHTML = '';
        selected.forEach(grenade => {
            const li = document.createElement('li');
            if (grenade.link) {
                li.innerHTML = `<a href="${grenade.link}" target="_blank">${grenade.name}</a>`;
            } else {
                li.textContent = grenade.name;
            }
            grenadesListEl.appendChild(li);
        });
    }

    function randomizeAll() {
        rollMap();
        rollWeaponClass();
        rollAugmentType();
        rollShield();
        rollGrenades();
    }

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();

            generateLoadoutBtn.addEventListener('click', randomizeAll);
            rerollMapBtn.addEventListener('click', rollMap);
            rerollWeaponClassBtn.addEventListener('click', rollWeaponClass);
            rerollAugmentTypeBtn.addEventListener('click', rollAugmentType);
            rerollShieldBtn.addEventListener('click', rollShield);
            rerollGrenadesBtn.addEventListener('click', rollGrenades);
        })
        .catch(error => console.error('Error loading data:', error));

    function copyResults() {
        const sections = document.querySelectorAll('.container > .section');
        const lines = [];
        sections.forEach(section => {
            if (section.style.display === 'none') return;
            const header = section.querySelector('.section-header h2');
            if (!header) return;
            const label = header.textContent.trim();
            const itemContainer = section.querySelector('.item-container');
            if (!itemContainer) return;
            // Check for list items
            const listItems = itemContainer.querySelectorAll('li');
            let value = '';
            if (listItems.length > 0) {
                const items = Array.from(listItems).map(li => li.textContent.trim());
                value = items.join(', ');
            } else {
                value = itemContainer.textContent.trim();
            }
            if (value) {
                lines.push(label + ': ' + value);
            }
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
