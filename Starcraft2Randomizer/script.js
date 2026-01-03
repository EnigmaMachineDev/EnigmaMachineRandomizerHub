document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-all');
    const rerollRaceBtn = document.getElementById('reroll-race');
    const rerollFocusBtn = document.getElementById('reroll-focus');

    const raceEl = document.getElementById('race');
    const unitFocusEl = document.getElementById('unit-focus');

    let data = {};
    const STORAGE_KEY = 'starcraft2Options';
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
});
