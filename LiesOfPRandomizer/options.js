document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const saveMessage = document.getElementById('save-message');
    
    const STORAGE_KEY = 'liesOfPOptions';
    const JSON_FILE = window.RANDOMIZER_JSON_FILE || 'randomizer.json';

    fetch(JSON_FILE)
        .then(res => res.json())
        .then(data => {
            initializeOptions(data);
            loadSavedOptions();
        })
        .catch(error => console.error('Error loading options:', error));

    function initializeOptions(data) {
        // Combine all weapons into one category
        const allWeapons = [];
        if (data.base_game) {
            if (data.base_game.normal_weapons) {
                data.base_game.normal_weapons.forEach(w => allWeapons.push({...w, dlc: false}));
            }
            if (data.base_game.special_weapons) {
                data.base_game.special_weapons.forEach(w => allWeapons.push({...w, dlc: false}));
            }
        }
        if (data.overture_dlc) {
            if (data.overture_dlc.normal_weapons) {
                data.overture_dlc.normal_weapons.forEach(w => allWeapons.push({...w, dlc: true}));
            }
            if (data.overture_dlc.special_weapons) {
                data.overture_dlc.special_weapons.forEach(w => allWeapons.push({...w, dlc: true}));
            }
        }
        if (allWeapons.length > 0) {
            addCategory('weapons', 'Weapons', allWeapons, true);
        }

        // Combine all legion arms into one category
        const allLegionArms = [];
        if (data.base_game && data.base_game.legion_arms) {
            data.base_game.legion_arms.forEach(a => allLegionArms.push({...a, dlc: false}));
        }
        if (data.overture_dlc && data.overture_dlc.legion_arms) {
            data.overture_dlc.legion_arms.forEach(a => allLegionArms.push({...a, dlc: true}));
        }
        if (allLegionArms.length > 0) {
            addCategory('legion_arms', 'Legion Arms', allLegionArms, true);
        }

        // Add endings
        if (data.endings && data.endings.length > 0) {
            addCategory('endings', 'Endings', data.endings, false);
        }
    }

    function addCategory(categoryKey, categoryName, items, hasDLC = false) {
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

        // Add DLC control buttons if category has DLC items
        if (hasDLC) {
            const selectDLCBtn = document.createElement('button');
            selectDLCBtn.className = 'category-btn';
            selectDLCBtn.textContent = 'Select DLC Only';
            selectDLCBtn.onclick = (e) => {
                e.stopPropagation();
                section.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.checked = cb.dataset.dlc === 'true';
                });
            };
            
            const deselectDLCBtn = document.createElement('button');
            deselectDLCBtn.className = 'category-btn';
            deselectDLCBtn.textContent = 'Deselect DLC';
            deselectDLCBtn.onclick = (e) => {
                e.stopPropagation();
                section.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (cb.dataset.dlc === 'true') cb.checked = false;
                });
            };
            
            controls.appendChild(selectDLCBtn);
            controls.appendChild(deselectDLCBtn);
        }

        const grid = document.createElement('div');
        grid.className = 'options-grid';

        items.forEach(item => {
            const itemName = item.name || item;
            const url = item.url || null;
            const isDLC = item.dlc || false;
            addOption(grid, categoryKey, itemName, itemName, url, isDLC);
        });

        header.onclick = () => {
            section.classList.toggle('collapsed');
        };

        section.appendChild(header);
        section.appendChild(controls);
        section.appendChild(grid);
        categoriesContainer.appendChild(section);
    }

    function addOption(container, category, id, label, url = null, isDLC = false) {
        const div = document.createElement('div');
        div.className = 'option-item';
        if (isDLC) div.classList.add('dlc-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `opt-${category}-${id.replace(/[^a-zA-Z0-9]/g, '-')}`;
        checkbox.checked = true;
        checkbox.dataset.category = category;
        checkbox.dataset.id = id;
        checkbox.dataset.dlc = isDLC.toString();

        const labelEl = document.createElement('label');
        labelEl.htmlFor = checkbox.id;
        
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.textContent = label + (isDLC ? ' (DLC)' : '');
            link.onclick = (e) => e.stopPropagation();
            labelEl.appendChild(link);
        } else {
            labelEl.textContent = label + (isDLC ? ' (DLC)' : '');
        }

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
