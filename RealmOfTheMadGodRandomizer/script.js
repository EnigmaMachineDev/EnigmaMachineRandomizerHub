document.addEventListener('DOMContentLoaded', () => {
    const selectedClassEl = document.getElementById('selected-class');
    const generateClassBtn = document.getElementById('generate-loadout');
    const rerollClassBtn = document.getElementById('reroll-class');

    let data = {};
    const STORAGE_KEY = 'realmOfTheMadGodOptions';
    let options = {};

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
        return data[category].filter(item => isEnabled(category, item));
    }

    // Generate a random class from enabled classes
    function generateClass() {
        const enabledClasses = getEnabledItems('classes');

        if (enabledClasses.length === 0) {
            selectedClassEl.textContent = 'No classes available - check options';
            selectedClassEl.style.color = '#ff6666';
            return;
        }

        const randomClass = getRandomValue(enabledClasses);
        selectedClassEl.textContent = randomClass;
        selectedClassEl.style.color = '#66cc66';
    }

    // Load data from JSON
    fetch('randomizer.json')
        .then(res => res.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            generateClass();

            // Add event listeners
            generateClassBtn.addEventListener('click', generateClass);
            rerollClassBtn.addEventListener('click', generateClass);
        })
        .catch(error => console.error('Error loading data:', error));
});
