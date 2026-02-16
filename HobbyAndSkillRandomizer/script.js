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
