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
