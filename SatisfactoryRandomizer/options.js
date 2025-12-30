document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const saveMessage = document.getElementById('save-message');

    const STORAGE_KEY = 'satisfactoryOptions';
    let data = {};
    let options = {};

    // Load the JSON data
    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            initializeUI();
        });

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

    function saveOptions() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
        showSaveMessage();
    }

    function showSaveMessage() {
        saveMessage.classList.add('show');
        setTimeout(() => {
            saveMessage.classList.remove('show');
        }, 2000);
    }

    function initializeUI() {
        const itemNames = Object.keys(data).sort();
        
        let html = '';
        
        itemNames.forEach(itemName => {
            const recipes = data[itemName];
            if (!options[itemName]) {
                options[itemName] = {};
            }
            
            // Count enabled recipes
            let enabledCount = 0;
            recipes.forEach(recipe => {
                const isEnabled = options[itemName].hasOwnProperty(recipe.name) ? options[itemName][recipe.name] : true;
                if (isEnabled) enabledCount++;
            });
            
            html += `
                <div class="category-section">
                    <div class="category-header" data-category="${itemName}">
                        <div class="category-title">
                            ${itemName}
                            <span class="category-count">(${enabledCount}/${recipes.length})</span>
                        </div>
                        <span class="collapse-icon">▼</span>
                    </div>
                    <div class="category-controls">
                        <button class="category-btn" data-action="select" data-category="${itemName}">Select All</button>
                        <button class="category-btn" data-action="deselect" data-category="${itemName}">Deselect All</button>
                    </div>
                    <div class="options-grid">
            `;
            
            recipes.forEach(recipe => {
                const isChecked = options[itemName].hasOwnProperty(recipe.name) ? options[itemName][recipe.name] : true;
                
                html += `
                    <div class="option-item">
                        <input type="checkbox" 
                               id="${itemName}-${recipe.name}" 
                               data-item="${itemName}" 
                               data-recipe="${recipe.name}"
                               ${isChecked ? 'checked' : ''}>
                        <label for="${itemName}-${recipe.name}">${recipe.name}</label>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        categoriesContainer.innerHTML = html;

        // Add event listeners to checkboxes
        document.querySelectorAll('input[type="checkbox"][data-recipe]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const itemName = e.target.getAttribute('data-item');
                const recipeName = e.target.getAttribute('data-recipe');
                if (!options[itemName]) {
                    options[itemName] = {};
                }
                options[itemName][recipeName] = e.target.checked;
                updateCategoryCount(itemName);
            });
        });

        // Add event listeners to category headers for collapse/expand
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const section = e.currentTarget.closest('.category-section');
                section.classList.toggle('collapsed');
            });
        });

        // Add event listeners to category control buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.target.getAttribute('data-action');
                const category = e.target.getAttribute('data-category');
                const checkboxes = document.querySelectorAll(`input[data-item="${category}"]`);
                
                checkboxes.forEach(checkbox => {
                    checkbox.checked = (action === 'select');
                    const recipeName = checkbox.getAttribute('data-recipe');
                    if (!options[category]) {
                        options[category] = {};
                    }
                    options[category][recipeName] = checkbox.checked;
                });
                
                updateCategoryCount(category);
            });
        });
    }

    function updateCategoryCount(itemName) {
        const checkboxes = document.querySelectorAll(`input[data-item="${itemName}"]`);
        const enabledCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        const totalCount = checkboxes.length;
        
        const countSpan = document.querySelector(`.category-header[data-category="${itemName}"] .category-count`);
        if (countSpan) {
            countSpan.textContent = `(${enabledCount}/${totalCount})`;
        }
    }

    selectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
            const itemName = checkbox.getAttribute('data-item');
            const recipeName = checkbox.getAttribute('data-recipe');
            if (itemName && recipeName) {
                if (!options[itemName]) {
                    options[itemName] = {};
                }
                options[itemName][recipeName] = true;
            }
        });
        
        // Update all category counts
        Object.keys(data).forEach(itemName => updateCategoryCount(itemName));
    });

    deselectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            const itemName = checkbox.getAttribute('data-item');
            const recipeName = checkbox.getAttribute('data-recipe');
            if (itemName && recipeName) {
                if (!options[itemName]) {
                    options[itemName] = {};
                }
                options[itemName][recipeName] = false;
            }
        });
        
        // Update all category counts
        Object.keys(data).forEach(itemName => updateCategoryCount(itemName));
    });

    expandAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.category-section').forEach(section => {
            section.classList.remove('collapsed');
        });
    });

    collapseAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.category-section').forEach(section => {
            section.classList.add('collapsed');
        });
    });

    saveBtn.addEventListener('click', () => {
        saveOptions();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Reset all options to defaults? This will enable all recipes.')) {
            options = {};
            localStorage.removeItem(STORAGE_KEY);
            initializeUI();
            showSaveMessage();
        }
    });
});
