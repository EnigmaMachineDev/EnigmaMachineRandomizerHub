document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const rerollCategoryBtn = document.getElementById('reroll-category');
    const rerollItemBtn = document.getElementById('reroll-item');
    
    const categoryEl = document.getElementById('category');
    const itemEl = document.getElementById('item');

    let data = {};
    let currentCategory = null;

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData.categories;
            generateAll();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            categoryEl.textContent = 'Error loading data';
            itemEl.textContent = 'Please refresh the page';
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getCategoryNames() {
        return Object.keys(data);
    }

    function generateCategory() {
        const categories = getCategoryNames();
        if (categories.length === 0) {
            categoryEl.textContent = 'No categories available';
            return null;
        }
        currentCategory = getRandomValue(categories);
        categoryEl.textContent = currentCategory;
        return currentCategory;
    }

    function generateItem() {
        if (!currentCategory || !data[currentCategory]) {
            itemEl.textContent = 'Please generate a category first';
            return;
        }
        
        const items = data[currentCategory].items;
        if (!items || items.length === 0) {
            itemEl.textContent = 'No items in this category';
            return;
        }
        
        const selectedItem = getRandomValue(items);
        itemEl.textContent = selectedItem;
    }

    function generateAll() {
        generateCategory();
        generateItem();
    }

    generateBtn.addEventListener('click', generateAll);
    rerollCategoryBtn.addEventListener('click', () => {
        generateCategory();
        generateItem();
    });
    rerollItemBtn.addEventListener('click', generateItem);
});
