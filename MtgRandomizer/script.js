document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-all');
    const rerollCombinationBtn = document.getElementById('reroll-combination');
    const combinationEl = document.getElementById('combination');

    let data = {};
    const STORAGE_KEY = 'mtgOptions';
    let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            generateCombination();
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

    function generateCombination() {
        // Collect all enabled items from all categories
        const allEnabledCombinations = [];
        
        if (data.categories) {
            Object.keys(data.categories).forEach(categoryKey => {
                const enabled = getEnabledItems(categoryKey);
                allEnabledCombinations.push(...enabled);
            });
        }

        if (allEnabledCombinations.length === 0) {
            combinationEl.textContent = 'No color combinations selected';
            return;
        }

        const selectedCombination = getRandomValue(allEnabledCombinations);
        combinationEl.textContent = selectedCombination;
    }

    generateBtn.addEventListener('click', generateCombination);
    rerollCombinationBtn.addEventListener('click', generateCombination);
});
