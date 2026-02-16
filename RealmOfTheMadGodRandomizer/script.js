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
