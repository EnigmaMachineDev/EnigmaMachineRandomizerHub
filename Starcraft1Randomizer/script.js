document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-all');
    const rerollRaceBtn = document.getElementById('reroll-race');
    const rerollFocusBtn = document.getElementById('reroll-focus');

    const raceEl = document.getElementById('race');
    const unitFocusEl = document.getElementById('unit-focus');

    let data = {};
    const STORAGE_KEY = 'starcraft1Options';
    let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            generateAll();
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
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
        if (!data.categories || !data.categories[category]) return [];
        return data.categories[category].items.filter(item => isEnabled(category, item));
    }

    function generateRace() {
        const enabled = getEnabledItems('Race');
        if (enabled.length === 0) {
            raceEl.textContent = 'No races selected';
            return;
        }
        const selectedRace = getRandomValue(enabled);
        raceEl.textContent = selectedRace;
    }

    function generateUnitFocus() {
        const enabled = getEnabledItems('Unit Focus');
        if (enabled.length === 0) {
            unitFocusEl.textContent = 'No unit focus selected';
            return;
        }
        const selectedFocus = getRandomValue(enabled);
        unitFocusEl.textContent = selectedFocus;
    }

    function generateAll() {
        generateRace();
        generateUnitFocus();
    }

    generateBtn.addEventListener('click', generateAll);
    rerollRaceBtn.addEventListener('click', generateRace);
    rerollFocusBtn.addEventListener('click', generateUnitFocus);

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
