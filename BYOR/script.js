document.addEventListener('DOMContentLoaded', () => {
    // Mode switching
    const builderModeBtn = document.getElementById('builder-mode-btn');
    const playerModeBtn = document.getElementById('player-mode-btn');
    const builderMode = document.getElementById('builder-mode');
    const playerMode = document.getElementById('player-mode');

    // Builder elements
    const randomizerNameInput = document.getElementById('randomizer-name');
    const categoriesContainer = document.getElementById('categories-container');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const jsonDisplay = document.getElementById('json-display');
    const jsonOutput = document.getElementById('json-output');
    const copyJsonBtn = document.getElementById('copy-json-btn');
    const jsonImport = document.getElementById('json-import');
    const jsonInput = document.getElementById('json-input');
    const loadJsonBtn = document.getElementById('load-json-btn');
    const cancelImportBtn = document.getElementById('cancel-import-btn');

    // Player elements
    const playerJsonInput = document.getElementById('player-json-input');
    const playerLoadBtn = document.getElementById('player-load-btn');
    const playerRandomizer = document.getElementById('player-randomizer');
    const playerRandomizerName = document.getElementById('player-randomizer-name');
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('results-container');

    let categories = [];
    let loadedRandomizerData = null;

    // Mode switching
    builderModeBtn.addEventListener('click', () => {
        builderModeBtn.classList.add('active');
        playerModeBtn.classList.remove('active');
        builderMode.style.display = 'block';
        playerMode.style.display = 'none';
    });

    playerModeBtn.addEventListener('click', () => {
        playerModeBtn.classList.add('active');
        builderModeBtn.classList.remove('active');
        playerMode.style.display = 'block';
        builderMode.style.display = 'none';
    });

    // Security: Sanitize string input to prevent XSS
    function sanitizeString(str) {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Security: Validate JSON structure
    function validateRandomizerJSON(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid JSON: Must be an object');
        }

        if (!data.name || typeof data.name !== 'string') {
            throw new Error('Invalid JSON: Missing or invalid "name" field');
        }

        if (data.name.length > 100) {
            throw new Error('Invalid JSON: Name too long (max 100 characters)');
        }

        if (!Array.isArray(data.categories)) {
            throw new Error('Invalid JSON: "categories" must be an array');
        }

        if (data.categories.length === 0) {
            throw new Error('Invalid JSON: Must have at least one category');
        }

        if (data.categories.length > 50) {
            throw new Error('Invalid JSON: Too many categories (max 50)');
        }

        data.categories.forEach((category, index) => {
            if (!category || typeof category !== 'object') {
                throw new Error(`Invalid JSON: Category ${index + 1} is not an object`);
            }

            if (!category.name || typeof category.name !== 'string') {
                throw new Error(`Invalid JSON: Category ${index + 1} missing or invalid "name"`);
            }

            if (category.name.length > 100) {
                throw new Error(`Invalid JSON: Category ${index + 1} name too long (max 100 characters)`);
            }

            if (!Array.isArray(category.items)) {
                throw new Error(`Invalid JSON: Category ${index + 1} "items" must be an array`);
            }

            if (category.items.length === 0) {
                throw new Error(`Invalid JSON: Category ${index + 1} must have at least one item`);
            }

            if (category.items.length > 500) {
                throw new Error(`Invalid JSON: Category ${index + 1} has too many items (max 500)`);
            }

            category.items.forEach((item, itemIndex) => {
                if (typeof item !== 'string') {
                    throw new Error(`Invalid JSON: Category ${index + 1}, item ${itemIndex + 1} must be a string`);
                }

                if (item.length > 200) {
                    throw new Error(`Invalid JSON: Category ${index + 1}, item ${itemIndex + 1} too long (max 200 characters)`);
                }
            });
        });

        return true;
    }

    // Builder: Add category
    function addCategory(name = '', items = ['']) {
        const categoryId = Date.now() + Math.random();
        const category = { id: categoryId, name, items };
        categories.push(category);
        renderCategory(category);
    }

    // Builder: Render category
    function renderCategory(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        categoryDiv.dataset.categoryId = category.id;

        const headerDiv = document.createElement('div');
        headerDiv.className = 'category-header';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'category-name-input';
        nameInput.placeholder = 'Category Name (e.g., Weapons, Classes)';
        nameInput.value = category.name;
        nameInput.maxLength = 100;
        nameInput.addEventListener('input', (e) => {
            category.name = e.target.value;
        });

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-category-btn';
        removeBtn.textContent = 'Remove Category';
        removeBtn.addEventListener('click', () => {
            categories = categories.filter(c => c.id !== category.id);
            categoryDiv.remove();
        });

        headerDiv.appendChild(nameInput);
        headerDiv.appendChild(removeBtn);

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'items-list';

        function renderItems() {
            itemsDiv.innerHTML = '';
            category.items.forEach((item, index) => {
                const itemEntry = document.createElement('div');
                itemEntry.className = 'item-entry';

                const itemInput = document.createElement('input');
                itemInput.type = 'text';
                itemInput.placeholder = 'Item name';
                itemInput.value = item;
                itemInput.maxLength = 200;
                itemInput.addEventListener('input', (e) => {
                    category.items[index] = e.target.value;
                });
                itemInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (category.items.length < 500) {
                            category.items.splice(index + 1, 0, '');
                            renderItems();
                            // Focus the next input after render
                            setTimeout(() => {
                                const inputs = itemsDiv.querySelectorAll('input[type="text"]');
                                if (inputs[index + 1]) {
                                    inputs[index + 1].focus();
                                }
                            }, 0);
                        } else {
                            showMessage('Maximum 500 items per category', 'error');
                        }
                    }
                });

                const removeItemBtn = document.createElement('button');
                removeItemBtn.className = 'remove-item-btn';
                removeItemBtn.textContent = 'X';
                removeItemBtn.addEventListener('click', () => {
                    if (category.items.length > 1) {
                        category.items.splice(index, 1);
                        renderItems();
                    } else {
                        showMessage('Each category must have at least one item', 'error');
                    }
                });

                itemEntry.appendChild(itemInput);
                itemEntry.appendChild(removeItemBtn);
                itemsDiv.appendChild(itemEntry);
            });

            const addItemBtn = document.createElement('button');
            addItemBtn.className = 'add-item-btn';
            addItemBtn.textContent = '+ Add Item';
            addItemBtn.addEventListener('click', () => {
                if (category.items.length < 500) {
                    category.items.push('');
                    renderItems();
                } else {
                    showMessage('Maximum 500 items per category', 'error');
                }
            });
            itemsDiv.appendChild(addItemBtn);
        }

        renderItems();

        categoryDiv.appendChild(headerDiv);
        categoryDiv.appendChild(itemsDiv);
        categoriesContainer.appendChild(categoryDiv);
    }

    // Builder: Show message
    function showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Builder: Export to JSON
    function exportToJSON() {
        const name = randomizerNameInput.value.trim();
        
        if (!name) {
            showMessage('Please enter a randomizer name', 'error');
            return;
        }

        if (categories.length === 0) {
            showMessage('Please add at least one category', 'error');
            return;
        }

        // Validate categories
        for (const category of categories) {
            if (!category.name.trim()) {
                showMessage('All categories must have a name', 'error');
                return;
            }

            const validItems = category.items.filter(item => item.trim() !== '');
            if (validItems.length === 0) {
                showMessage(`Category "${category.name}" must have at least one non-empty item`, 'error');
                return;
            }
        }

        const exportData = {
            name: sanitizeString(name),
            categories: categories.map(cat => ({
                name: sanitizeString(cat.name.trim()),
                items: cat.items.filter(item => item.trim() !== '').map(item => sanitizeString(item.trim()))
            }))
        };

        try {
            validateRandomizerJSON(exportData);
            const jsonString = JSON.stringify(exportData, null, 2);
            jsonOutput.value = jsonString;
            jsonDisplay.style.display = 'block';
            jsonImport.style.display = 'none';
            showMessage('Randomizer exported successfully!', 'success');
        } catch (error) {
            showMessage(`Export failed: ${error.message}`, 'error');
        }
    }

    // Builder: Import from JSON
    function importFromJSON() {
        jsonImport.style.display = 'block';
        jsonDisplay.style.display = 'none';
    }

    function loadJSON() {
        const jsonString = jsonInput.value.trim();
        
        if (!jsonString) {
            showMessage('Please paste JSON data', 'error');
            return;
        }

        try {
            const data = JSON.parse(jsonString);
            validateRandomizerJSON(data);

            // Clear existing categories
            categories = [];
            categoriesContainer.innerHTML = '';

            // Load data
            randomizerNameInput.value = sanitizeString(data.name);
            
            data.categories.forEach(cat => {
                addCategory(
                    sanitizeString(cat.name),
                    cat.items.map(item => sanitizeString(item))
                );
            });

            jsonImport.style.display = 'none';
            jsonInput.value = '';
            showMessage('Randomizer imported successfully!', 'success');
        } catch (error) {
            showMessage(`Import failed: ${error.message}`, 'error');
        }
    }

    // Builder: Copy JSON to clipboard
    function copyToClipboard() {
        jsonOutput.select();
        document.execCommand('copy');
        showMessage('JSON copied to clipboard!', 'success');
    }

    // Player: Load randomizer
    function loadPlayerRandomizer() {
        const jsonString = playerJsonInput.value.trim();
        
        if (!jsonString) {
            showMessage('Please paste JSON data', 'error');
            return;
        }

        try {
            const data = JSON.parse(jsonString);
            validateRandomizerJSON(data);

            loadedRandomizerData = {
                name: sanitizeString(data.name),
                categories: data.categories.map(cat => ({
                    name: sanitizeString(cat.name),
                    items: cat.items.map(item => sanitizeString(item))
                }))
            };

            playerRandomizerName.textContent = loadedRandomizerData.name;
            playerRandomizer.style.display = 'block';
            resultsContainer.innerHTML = '';
            showMessage('Randomizer loaded successfully!', 'success');
            // Auto-generate on load
            generateRandomBuild();
        } catch (error) {
            showMessage(`Load failed: ${error.message}`, 'error');
        }
    }

    // Player: Generate random item for a category
    function generateRandomItem(category) {
        return category.items[Math.floor(Math.random() * category.items.length)];
    }

    // Player: Render a single category section
    function renderCategorySection(category, categoryIndex) {
        const section = document.createElement('div');
        section.className = 'section';
        section.dataset.categoryIndex = categoryIndex;

        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category.name + ':';

        const rerollBtn = document.createElement('button');
        rerollBtn.className = 'reroll-btn';
        rerollBtn.textContent = '↻';
        rerollBtn.title = 'Reroll ' + category.name;
        rerollBtn.addEventListener('click', () => {
            const randomItem = generateRandomItem(category);
            const itemContainer = section.querySelector('.item-container');
            itemContainer.textContent = randomItem;
        });

        sectionHeader.appendChild(categoryTitle);
        sectionHeader.appendChild(rerollBtn);

        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';
        itemContainer.textContent = generateRandomItem(category);

        section.appendChild(sectionHeader);
        section.appendChild(itemContainer);

        return section;
    }

    // Player: Generate random build
    function generateRandomBuild() {
        if (!loadedRandomizerData) {
            showMessage('Please load a randomizer first', 'error');
            return;
        }

        resultsContainer.innerHTML = '';

        loadedRandomizerData.categories.forEach((category, index) => {
            const categorySection = renderCategorySection(category, index);
            resultsContainer.appendChild(categorySection);
        });
    }

    // Event listeners
    addCategoryBtn.addEventListener('click', () => {
        if (categories.length < 50) {
            addCategory();
        } else {
            showMessage('Maximum 50 categories allowed', 'error');
        }
    });
    exportBtn.addEventListener('click', exportToJSON);
    importBtn.addEventListener('click', importFromJSON);
    loadJsonBtn.addEventListener('click', loadJSON);
    cancelImportBtn.addEventListener('click', () => {
        jsonImport.style.display = 'none';
        jsonInput.value = '';
    });
    copyJsonBtn.addEventListener('click', copyToClipboard);
    playerLoadBtn.addEventListener('click', loadPlayerRandomizer);
    generateBtn.addEventListener('click', generateRandomBuild);

    // Initialize with one category
    addCategory();
});
