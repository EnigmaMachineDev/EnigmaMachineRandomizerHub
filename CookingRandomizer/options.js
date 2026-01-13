document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const saveMessage = document.getElementById('save-message');
    const dietaryBtns = document.querySelectorAll('.dietary-btn');
    
    const STORAGE_KEY = 'cookingOptions';
    const DIETARY_MODE_KEY = 'cookingDietaryMode';
    let currentDietaryMode = 'normal';

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            initializeOptions(data);
            loadSavedOptions();
            loadDietaryMode();
        })
        .catch(error => console.error('Error loading options:', error));

    function loadDietaryMode() {
        const saved = localStorage.getItem(DIETARY_MODE_KEY);
        if (saved) {
            currentDietaryMode = saved;
        }
        updateDietaryModeUI();
    }

    function updateDietaryModeUI() {
        dietaryBtns.forEach(btn => {
            if (btn.dataset.mode === currentDietaryMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    dietaryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentDietaryMode = btn.dataset.mode;
            localStorage.setItem(DIETARY_MODE_KEY, currentDietaryMode);
            updateDietaryModeUI();
            showSaveMessage();
        });
    });

    function initializeOptions(data) {
        if (!data.sections) return;
        
        data.sections.forEach(section => {
            if (section.subsections) {
                section.subsections.forEach(subsection => {
                    const categoryKey = `${section.name}_${subsection.name}`;
                    const categoryName = `${section.name} - ${subsection.name}`;
                    if (subsection.options && subsection.options.length > 0) {
                        addCategory(categoryKey, categoryName, subsection.options);
                    }
                });
            } else if (section.options && section.options.length > 0) {
                addCategory(section.name, section.name, section.options);
            }
        });
    }

    function addCategory(categoryKey, categoryName, items) {
        const section = document.createElement('div');
        section.className = 'category-section collapsed';
        section.dataset.category = categoryKey;

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

        const grid = document.createElement('div');
        grid.className = 'options-grid';

        items.forEach(item => {
            const itemName = typeof item === 'object' ? item.name : item;
            addOption(grid, categoryKey, itemName, itemName);
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
        showSaveMessage();
    }

    function showSaveMessage() {
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
            localStorage.removeItem(DIETARY_MODE_KEY);
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
            currentDietaryMode = 'normal';
            updateDietaryModeUI();
            saveOptions();
        }
    });
});
