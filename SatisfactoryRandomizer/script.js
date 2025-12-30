document.addEventListener('DOMContentLoaded', () => {
    const recipeSectionsEl = document.getElementById('recipe-sections');
    const generateRecipesBtn = document.getElementById('generate-recipes');

    let data = {};
    const STORAGE_KEY = 'satisfactoryOptions';
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

    function getEnabledRecipes(itemName) {
        const recipes = data[itemName];
        if (!recipes || recipes.length === 0) return [];
        
        // If no options saved for this item, all recipes are enabled
        if (!options[itemName]) {
            return recipes;
        }
        
        // Filter recipes based on saved options
        return recipes.filter(recipe => {
            const isEnabled = options[itemName].hasOwnProperty(recipe.name) ? options[itemName][recipe.name] : true;
            return isEnabled;
        });
    }

    function getEnabledItems() {
        return Object.keys(data).filter(itemName => {
            const enabledRecipes = getEnabledRecipes(itemName);
            return enabledRecipes.length > 0;
        });
    }

    function setRecipe(itemName) {
        const enabledRecipes = getEnabledRecipes(itemName);
        if (enabledRecipes.length === 0) return '<p>No recipes enabled for this item.</p>';
        
        const recipe = getRandomValue(enabledRecipes);
        
        let result = `<div class="recipe-item">`;
        result += `<h3>${itemName}</h3>`;
        result += `<p><strong>Recipe:</strong> ${recipe.name}</p>`;
        result += `<p><strong>Inputs:</strong> ${recipe.inputs}</p>`;
        result += `<p><strong>Outputs:</strong> ${recipe.outputs}</p>`;
        result += `</div>`;
        
        return result;
    }

    function randomizeAll() {
        const enabledItems = getEnabledItems();
        
        if (enabledItems.length === 0) {
            recipeSectionsEl.innerHTML = '<p>No items enabled. Please enable some options.</p>';
            return;
        }

        let html = '';
        
        enabledItems.forEach(itemName => {
            html += `<div class="section">`;
            html += `<div class="section-header">`;
            html += `<h2>${itemName}</h2>`;
            html += `<button class="reroll-btn" data-item="${itemName}">↻</button>`;
            html += `</div>`;
            html += `<div class="item-container" id="recipe-${itemName.replace(/\s+/g, '-')}">`;
            html += setRecipe(itemName);
            html += `</div>`;
            html += `</div>`;
        });
        
        recipeSectionsEl.innerHTML = html;
        
        // Add event listeners to individual reroll buttons
        document.querySelectorAll('.reroll-btn[data-item]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemName = e.target.getAttribute('data-item');
                const containerId = `recipe-${itemName.replace(/\s+/g, '-')}`;
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = setRecipe(itemName);
                }
            });
        });
    }

    generateRecipesBtn.addEventListener('click', randomizeAll);
});
