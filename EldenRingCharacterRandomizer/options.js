document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const saveMessage = document.getElementById('save-message');
    const magicTypeFiltersContainer = document.getElementById('magic-type-filters');
    
    const STORAGE_KEY = 'eldenRingOptions';
    const JSON_FILE = window.RANDOMIZER_JSON_FILE || 'randomizer.json';

    let magicTypes = [];

    fetch(JSON_FILE)
        .then(res => res.json())
        .then(data => {
            initializeOptions(data);
            loadSavedOptions();
        })
        .catch(error => console.error('Error loading options:', error));

    function initializeOptions(data) {
        Object.keys(data).forEach(categoryKey => {
            const categoryData = data[categoryKey];
            
            // Handle flat arrays (e.g., weapons)
            if (Array.isArray(categoryData) && categoryData.length > 0) {
                // Special handling for caster_weapons
                if (categoryKey === 'caster_weapons') {
                    addCategory(categoryKey, 'Caster Weapons', categoryData);
                } else {
                    const categoryName = categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    addCategory(categoryKey, categoryName, categoryData);
                }
            }
            // Handle nested objects - combine armor sets into one category
            else if (typeof categoryData === 'object' && categoryData !== null && !Array.isArray(categoryData)) {
                if (categoryKey === 'armor') {
                    // Combine all armor sets into one category
                    const allArmorSets = [];
                    Object.keys(categoryData).forEach(subKey => {
                        if (Array.isArray(categoryData[subKey])) {
                            categoryData[subKey].forEach(item => {
                                allArmorSets.push({...item, _subcategory: subKey});
                            });
                        }
                    });
                    if (allArmorSets.length > 0) {
                        addCombinedArmorCategory('armor', 'Armor Sets', allArmorSets, categoryData);
                    }
                } else if (categoryKey === 'magic') {
                    // Combine all magic into one category
                    const allSpells = [];
                    Object.keys(categoryData).forEach(subKey => {
                        if (Array.isArray(categoryData[subKey])) {
                            categoryData[subKey].forEach(spell => {
                                allSpells.push({...spell, _spellType: subKey});
                            });
                        }
                    });
                    if (allSpells.length > 0) {
                        magicTypes = Object.keys(categoryData);
                        addCategory('magic', 'Magic', allSpells);
                    }
                }
            }
        });
        
        // Create top-level magic type filter buttons if we have magic types
        if (magicTypes.length > 0) {
            createMagicTypeFilters();
        }
    }

    function createMagicTypeFilters() {
        magicTypeFiltersContainer.style.display = 'block';
        
        const label = document.createElement('div');
        label.className = 'filter-label';
        label.textContent = 'Magic Type Filters:';
        magicTypeFiltersContainer.appendChild(label);
        
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        
        magicTypes.forEach(spellType => {
            const typeName = spellType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            const filterBtn = document.createElement('button');
            filterBtn.className = 'btn btn-filter';
            filterBtn.textContent = `${typeName} Only`;
            filterBtn.onclick = () => {
                // Filter both magic and caster_weapons categories
                filterByMagicType(spellType);
            };
            
            buttonGroup.appendChild(filterBtn);
        });
        
        magicTypeFiltersContainer.appendChild(buttonGroup);
    }

    function filterByMagicType(magicType) {
        // Filter magic category
        const magicSection = document.querySelector('[data-category="magic"]');
        if (magicSection) {
            magicSection.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                const itemName = cb.dataset.id;
                const magicCategory = categoriesContainer.querySelector('[data-category="magic"]');
                if (magicCategory) {
                    const allSpells = Array.from(magicCategory.querySelectorAll('input[type="checkbox"]')).map(checkbox => {
                        return {
                            name: checkbox.dataset.id,
                            element: checkbox
                        };
                    });
                    
                    // We need to check the _spellType from our stored data
                    // For now, we'll use a data attribute approach
                    const spellTypeAttr = cb.getAttribute('data-spell-type');
                    cb.checked = spellTypeAttr === magicType;
                }
            });
        }
        
        // Filter caster_weapons category
        const casterWeaponsSection = document.querySelector('[data-category="caster_weapons"]');
        if (casterWeaponsSection) {
            casterWeaponsSection.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                const magicTypeAttr = cb.getAttribute('data-magic-type');
                cb.checked = magicTypeAttr === magicType;
            });
        }
    }

    function addCombinedArmorCategory(categoryKey, categoryName, items, originalData) {
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
            const itemName = item.name || item;
            const subcategory = item._subcategory;
            const url = item.url || null;
            addOption(grid, subcategory, itemName, itemName, url, item);
        });

        header.onclick = () => {
            section.classList.toggle('collapsed');
        };

        section.appendChild(header);
        section.appendChild(controls);
        section.appendChild(grid);
        categoriesContainer.appendChild(section);
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
            const itemName = item.name || item;
            const url = item.url || null;
            addOption(grid, categoryKey, itemName, itemName, url, item);
        });

        header.onclick = () => {
            section.classList.toggle('collapsed');
        };

        section.appendChild(header);
        section.appendChild(controls);
        section.appendChild(grid);
        categoriesContainer.appendChild(section);
    }

    function addOption(container, category, id, label, url = null, item = null) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${category}-${id}`;
        checkbox.dataset.category = category;
        checkbox.dataset.id = id;
        checkbox.checked = true;
        
        // Add data attributes for filtering
        if (item) {
            if (item._spellType) {
                checkbox.setAttribute('data-spell-type', item._spellType);
            }
            if (item.magic_type) {
                checkbox.setAttribute('data-magic-type', item.magic_type);
            }
        }

        const labelEl = document.createElement('label');
        labelEl.htmlFor = checkbox.id;
        
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.textContent = label;
            link.className = 'option-link';
            labelEl.appendChild(link);
        } else {
            labelEl.textContent = label;
        }

        optionDiv.appendChild(checkbox);
        optionDiv.appendChild(labelEl);
        container.appendChild(optionDiv);
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
