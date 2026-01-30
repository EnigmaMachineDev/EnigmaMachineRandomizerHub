document.addEventListener('DOMContentLoaded', () => {
    const recipeSectionsEl = document.getElementById('recipe-sections');
    const generateRecipesBtn = document.getElementById('generate-recipes');

    let data = {};
    const STORAGE_KEY = 'satisfactoryOptions';
    let options = {};

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

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

    function setRecipe(itemName, container) {
        const enabledRecipes = getEnabledRecipes(itemName);
        container.innerHTML = '';
        
        if (enabledRecipes.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No recipes enabled for this item.';
            container.appendChild(p);
            return;
        }
        
        const recipe = getRandomValue(enabledRecipes);
        
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe-item';
        
        const title = document.createElement('h3');
        title.textContent = itemName;
        recipeDiv.appendChild(title);
        
        const recipeName = document.createElement('p');
        const recipeStrong = document.createElement('strong');
        recipeStrong.textContent = 'Recipe:';
        recipeName.appendChild(recipeStrong);
        recipeName.appendChild(document.createTextNode(' ' + recipe.name));
        recipeDiv.appendChild(recipeName);
        
        const inputs = document.createElement('p');
        const inputsStrong = document.createElement('strong');
        inputsStrong.textContent = 'Inputs:';
        inputs.appendChild(inputsStrong);
        inputs.appendChild(document.createTextNode(' ' + recipe.inputs));
        recipeDiv.appendChild(inputs);
        
        const outputs = document.createElement('p');
        const outputsStrong = document.createElement('strong');
        outputsStrong.textContent = 'Outputs:';
        outputs.appendChild(outputsStrong);
        outputs.appendChild(document.createTextNode(' ' + recipe.outputs));
        recipeDiv.appendChild(outputs);
        
        container.appendChild(recipeDiv);
    }

    function randomizeAll() {
        const enabledItems = getEnabledItems();
        
        recipeSectionsEl.innerHTML = '';
        
        if (enabledItems.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No items enabled. Please enable some options.';
            recipeSectionsEl.appendChild(p);
            return;
        }
        
        enabledItems.forEach(itemName => {
            const section = document.createElement('div');
            section.className = 'section';
            
            const header = document.createElement('div');
            header.className = 'section-header';
            
            const title = document.createElement('h2');
            title.textContent = itemName;
            header.appendChild(title);
            
            const rerollBtn = document.createElement('button');
            rerollBtn.className = 'reroll-btn';
            rerollBtn.textContent = '↻';
            rerollBtn.addEventListener('click', () => {
                setRecipe(itemName, itemContainer);
            });
            header.appendChild(rerollBtn);
            
            section.appendChild(header);
            
            const itemContainer = document.createElement('div');
            itemContainer.className = 'item-container';
            itemContainer.id = `recipe-${itemName.replace(/\s+/g, '-')}`;
            
            setRecipe(itemName, itemContainer);
            
            section.appendChild(itemContainer);
            recipeSectionsEl.appendChild(section);
        });
    }

    generateRecipesBtn.addEventListener('click', randomizeAll);
});
