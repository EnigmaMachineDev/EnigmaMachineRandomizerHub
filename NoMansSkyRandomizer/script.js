document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-all');
    const rerollActivityBtn = document.getElementById('reroll-activity');
    const rerollRaceBtn = document.getElementById('reroll-race');

    const activityNameEl = document.getElementById('activity-name');
    const activityDescriptionEl = document.getElementById('activity-description');
    const raceEl = document.getElementById('race');

    let data = {};
    const STORAGE_KEY = 'noMansSkyOptions';
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
        if (!data[category]) return [];
        return data[category].filter(item => {
            const itemName = item.name || item;
            return isEnabled(category, itemName);
        });
    }

    function generateActivity() {
        const enabled = getEnabledItems('profitable_activities_and_jobs');
        if (enabled.length === 0) {
            activityNameEl.textContent = 'No activities selected';
            activityDescriptionEl.textContent = '';
            return;
        }
        const selectedActivity = getRandomValue(enabled);
        activityNameEl.textContent = selectedActivity.name;
        activityDescriptionEl.textContent = selectedActivity.description;
    }

    function generateRace() {
        const enabled = getEnabledItems('playable_races');
        if (enabled.length === 0) {
            raceEl.textContent = 'No races selected';
            return;
        }
        const selectedRace = getRandomValue(enabled);
        raceEl.textContent = selectedRace;
    }

    function generateAll() {
        generateActivity();
        generateRace();
    }

    generateBtn.addEventListener('click', generateAll);
    rerollActivityBtn.addEventListener('click', generateActivity);
    rerollRaceBtn.addEventListener('click', generateRace);
});
