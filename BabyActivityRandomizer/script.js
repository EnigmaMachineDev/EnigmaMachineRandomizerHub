document.addEventListener('DOMContentLoaded', () => {
    const categoryEl = document.getElementById('category');
    const activityEl = document.getElementById('activity');

    const rerollCategoryBtn = document.getElementById('reroll-category');
    const rerollActivityBtn = document.getElementById('reroll-activity');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let categoriesData;
    let currentCategory = null;

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const STORAGE_KEY = 'babyActivityOptions';
    let options = {};

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) {}
        }
    }

    function isEnabled(categoryName, itemName) {
        if (!options[categoryName]) return true;
        if (!options[categoryName].hasOwnProperty(itemName)) return true;
        return options[categoryName][itemName];
    }

    function getEnabledCategories() {
        if (!categoriesData) return [];
        return categoriesData.filter(cat => {
            const enabledItems = cat.items.filter(item => isEnabled(cat.name, item));
            return enabledItems.length > 0;
        });
    }

    function getEnabledItems(category) {
        if (!category || !category.items) return [];
        return category.items.filter(item => isEnabled(category.name, item));
    }

    function generateCategory() {
        const enabledCategories = getEnabledCategories();
        if (enabledCategories.length === 0) {
            categoryEl.textContent = 'No categories enabled';
            activityEl.textContent = '';
            currentCategory = null;
            return;
        }
        currentCategory = getRandomElement(enabledCategories);
        categoryEl.textContent = currentCategory.name;
        generateActivity();
    }

    function generateActivity() {
        if (!currentCategory) {
            generateCategory();
            return;
        }
        const enabledItems = getEnabledItems(currentCategory);
        if (enabledItems.length === 0) {
            activityEl.textContent = 'No activities enabled in this category';
            return;
        }
        const randomActivity = getRandomElement(enabledItems);
        activityEl.textContent = randomActivity;
    }

    function randomizeAll() {
        generateCategory();
    }

    loadOptions();

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            categoriesData = data.categories;

            loadOptions();
            randomizeAll();

            rerollCategoryBtn.addEventListener('click', generateCategory);
            rerollActivityBtn.addEventListener('click', generateActivity);
            generateLoadoutBtn.addEventListener('click', randomizeAll);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Failed to load necessary data. Please check the console for more details and ensure the .json file is present and correctly formatted.');
        });
});
