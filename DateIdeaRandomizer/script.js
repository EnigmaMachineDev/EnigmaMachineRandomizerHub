document.addEventListener('DOMContentLoaded', () => {
    const dateIdeaEl = document.getElementById('date-idea');
    const dateCategoryEl = document.getElementById('date-category');
    const rerollDateBtn = document.getElementById('reroll-date');
    const generateDateBtn = document.getElementById('generate-date');

    let data = {};
    const STORAGE_KEY = 'dateIdeaOptions';
    let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading options:', e);
                options = {};
            }
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

    function setDateIdea() {
        // Get all categories
        const categories = Object.keys(data.categories || {});
        
        // Filter to categories that have enabled items
        const availableCategories = categories.filter(cat => getEnabledItems(cat).length > 0);
        
        if (availableCategories.length === 0) {
            dateIdeaEl.innerHTML = '<p>No date ideas enabled. Please enable some options.</p>';
            dateCategoryEl.textContent = '';
            return;
        }
        
        // Pick a random category
        const category = getRandomValue(availableCategories);
        const enabledItems = getEnabledItems(category);
        const dateIdea = getRandomValue(enabledItems);
        
        // Display the date idea
        dateIdeaEl.innerHTML = `<div class="date-idea-display">
            <h3>${dateIdea}</h3>
        </div>`;
        
        // Display the category
        dateCategoryEl.textContent = category;
    }

    function randomizeAll() {
        setDateIdea();
    }

    rerollDateBtn.addEventListener('click', setDateIdea);
    generateDateBtn.addEventListener('click', randomizeAll);

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
