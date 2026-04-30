document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const rerollCategoryBtn = document.getElementById('reroll-category');
    const rerollItemBtn = document.getElementById('reroll-item');

    const categoryEl = document.getElementById('category');
    const itemEl = document.getElementById('item');

    let data = {};
    let currentCategory = null;

    const STORAGE_KEY = 'calisthenicsOptions';
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
        return Object.keys(data).filter(catName => {
            return data[catName].items.some(item => isEnabled(catName, item));
        });
    }

    function getEnabledItems(categoryName) {
        if (!data[categoryName]) return [];
        return data[categoryName].items.filter(item => isEnabled(categoryName, item));
    }

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateCategory() {
        const categories = getEnabledCategories();
        if (categories.length === 0) {
            categoryEl.textContent = 'No categories enabled';
            itemEl.textContent = '';
            currentCategory = null;
            return null;
        }
        currentCategory = getRandomValue(categories);
        categoryEl.textContent = currentCategory;
        return currentCategory;
    }

    function generateItem() {
        if (!currentCategory) {
            itemEl.textContent = 'Please generate a category first';
            return;
        }
        const items = getEnabledItems(currentCategory);
        if (items.length === 0) {
            itemEl.textContent = 'No items enabled in this category';
            return;
        }
        itemEl.textContent = getRandomValue(items);
    }

    function generateAll() {
        generateCategory();
        generateItem();
    }

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData.categories;
            loadOptions();
            generateAll();

            generateBtn.addEventListener('click', generateAll);
            rerollCategoryBtn.addEventListener('click', () => {
                generateCategory();
                generateItem();
            });
            rerollItemBtn.addEventListener('click', generateItem);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            categoryEl.textContent = 'Error loading data';
            itemEl.textContent = 'Please refresh the page';
        });

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
