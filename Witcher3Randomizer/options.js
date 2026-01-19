document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const saveMessage = document.getElementById('save-message');
    
    const STORAGE_KEY = 'witcher3Options';
    const JSON_FILE = 'randomizer.json';

    fetch(JSON_FILE)
        .then(res => res.json())
        .then(data => {
            initializeOptions(data);
            loadSavedOptions();
        })
        .catch(error => console.error('Error loading options:', error));

    function initializeOptions(data) {
        data.categories.forEach(category => {
            addCategory(category.name, category.options);
        });
    }

    function addCategory(categoryName, items) {
        const section = document.createElement('div');
        section.className = 'category-section collapsed';
        section.dataset.category = categoryName;

        const header = document.createElement('div');
        header.className = 'category-header';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'category-title';
        titleDiv.innerHTML = `${categoryName} <span class="category-count">(${items.length} items)</span>`;
        
        const icon = document.createElement('span');
        icon.className = 'collapse-icon';
        icon.textContent = '▼';
        
        header.appendChild(titleDiv);
        header.appendChild(icon);

        const controls = document.createElement('div');
        controls.className = 'category-controls';
        
        const selectCategoryBtn = document.createElement('button');
        selectCategoryBtn.className = 'category-btn';
        selectCategoryBtn.textContent = 'Select All';
        selectCategoryBtn.onclick = (e) => {
            e.stopPropagation();
            section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        };
        
        const deselectCategoryBtn = document.createElement('button');
        deselectCategoryBtn.className = 'category-btn';
        deselectCategoryBtn.textContent = 'Deselect All';
        deselectCategoryBtn.onclick = (e) => {
            e.stopPropagation();
            section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        };
        
        controls.appendChild(selectCategoryBtn);
        controls.appendChild(deselectCategoryBtn);

        const hasDLC = items.some(item => item.dlc !== undefined);
        if (hasDLC) {
            const selectDLCBtn = document.createElement('button');
            selectDLCBtn.className = 'category-btn';
            selectDLCBtn.textContent = 'Select DLC';
            selectDLCBtn.onclick = (e) => {
                e.stopPropagation();
                section.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    const itemName = cb.dataset.id;
                    const item = items.find(i => (i.name || i) === itemName);
                    if (item && item.dlc) cb.checked = true;
                });
            };
            
            const deselectDLCBtn = document.createElement('button');
            deselectDLCBtn.className = 'category-btn';
            deselectDLCBtn.textContent = 'Deselect DLC';
            deselectDLCBtn.onclick = (e) => {
                e.stopPropagation();
                section.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    const itemName = cb.dataset.id;
                    const item = items.find(i => (i.name || i) === itemName);
                    if (item && item.dlc) cb.checked = false;
                });
            };
            
            controls.appendChild(selectDLCBtn);
            controls.appendChild(deselectDLCBtn);
        }

        const grid = document.createElement('div');
        grid.className = 'options-grid';

        items.forEach(item => {
            const itemName = item.name || item;
            addOption(grid, categoryName, itemName, itemName);
        });

        header.onclick = () => {
            section.classList.toggle('collapsed');
        };

        section.appendChild(header);
        section.appendChild(controls);
        section.appendChild(grid);
        categoriesContainer.appendChild(section);
    }

    function addOption(container, category, id, label) {
        const div = document.createElement('div');
        div.className = 'option-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `opt-${category}-${id.replace(/[^a-zA-Z0-9]/g, '-')}`;
        checkbox.checked = true;
        checkbox.dataset.category = category;
        checkbox.dataset.id = id;

        const labelEl = document.createElement('label');
        labelEl.htmlFor = checkbox.id;
        labelEl.textContent = label;

        div.appendChild(checkbox);
        div.appendChild(labelEl);
        container.appendChild(div);
    }

    function loadSavedOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const options = JSON.parse(saved);
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (options[cb.dataset.category]?.[cb.dataset.id] !== undefined) {
                        cb.checked = options[cb.dataset.category][cb.dataset.id];
                    }
                });
            } catch (e) {
                console.error('Error loading saved options:', e);
            }
        }
    }

    function saveOptions() {
        const options = {};
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (!options[cb.dataset.category]) {
                options[cb.dataset.category] = {};
            }
            options[cb.dataset.category][cb.dataset.id] = cb.checked;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
        saveMessage.classList.add('show');
        setTimeout(() => saveMessage.classList.remove('show'), 2000);
    }

    selectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    });

    deselectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
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
        setTimeout(() => window.location.href = 'index.html', 500);
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Reset all options to defaults (all enabled)?')) {
            localStorage.removeItem(STORAGE_KEY);
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
            saveOptions();
        }
    });
});
