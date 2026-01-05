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
});
