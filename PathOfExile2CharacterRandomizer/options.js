document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const saveMessage = document.getElementById('save-message');
    
    const STORAGE_KEY = 'pathOfExile2Options';
    const JSON_FILE = window.RANDOMIZER_JSON_FILE || 'randomizer.json';

    fetch(JSON_FILE)
        .then(res => res.json())
        .then(data => {
            initializeOptions(data);
            loadSavedOptions();
        })
        .catch(error => console.error('Error loading options:', error));

    function addClassAscendancySection(classes) {
        const totalAsc = classes.reduce((sum, cls) => sum + cls.ascendancies.length, 0);
        const section = document.createElement('div');
        section.className = 'category-section collapsed';

        const header = document.createElement('div');
        header.className = 'category-header';
        const titleDiv = document.createElement('div');
        titleDiv.className = 'category-title';
        titleDiv.innerHTML = `Classes & Ascendancies <span class="category-count">(${classes.length} classes, ${totalAsc} ascendancies)</span>`;
        const icon = document.createElement('span');
        icon.className = 'collapse-icon';
        icon.textContent = '▼';
        header.appendChild(titleDiv);
        header.appendChild(icon);

        const controls = document.createElement('div');
        controls.className = 'category-controls';
        const selectBtn = document.createElement('button');
        selectBtn.className = 'category-btn';
        selectBtn.textContent = 'Select All';
        selectBtn.addEventListener('click', (e) => { e.stopPropagation(); section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true); });
        const deselectBtn = document.createElement('button');
        deselectBtn.className = 'category-btn';
        deselectBtn.textContent = 'Deselect All';
        deselectBtn.addEventListener('click', (e) => { e.stopPropagation(); section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false); });
        controls.appendChild(selectBtn);
        controls.appendChild(deselectBtn);

        const grid = document.createElement('div');
        grid.className = 'options-grid';

        classes.forEach(cls => {
            const groupHeader = document.createElement('div');
            groupHeader.className = 'class-group-header';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = `opt-classes-${cls.name.replace(/[^a-zA-Z0-9]/g, '-')}`;
            cb.checked = true;
            cb.dataset.category = 'classes';
            cb.dataset.id = cls.name;
            const lbl = document.createElement('label');
            lbl.htmlFor = cb.id;
            lbl.textContent = cls.name;
            groupHeader.appendChild(cb);
            groupHeader.appendChild(lbl);
            grid.appendChild(groupHeader);
            cls.ascendancies.forEach(asc => addOption(grid, 'ascendancies', asc, asc));
        });

        header.addEventListener('click', () => section.classList.toggle('collapsed'));
        section.appendChild(header);
        section.appendChild(controls);
        section.appendChild(grid);
        categoriesContainer.appendChild(section);
    }

    function initializeOptions(data) {
        addClassAscendancySection(data.classes || []);
        addCategory('weapons', 'Weapons', data.weapons || []);
        addCategory('defense', 'Defense', data.defense || []);

        const skillGroups = [];
        const seen = new Set();
        (data.weapons || []).forEach(weapon => {
            const items = [];
            weapon.skills.forEach(s => { if (!seen.has(s)) { seen.add(s); items.push({ name: s }); } });
            if (items.length) skillGroups.push({ label: weapon.name, items });
        });
        if (data.ascendancySkills) {
            const items = [];
            Object.values(data.ascendancySkills).forEach(skills => {
                skills.forEach(s => { if (!seen.has(s)) { seen.add(s); items.push({ name: s }); } });
            });
            if (items.length) skillGroups.push({ label: 'Ascendancy', items });
        }
        addGroupedCategory('skills', 'Skills', skillGroups);
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
            const url = item.url || item.link || null;
            addOption(grid, categoryKey, itemName, itemName, url);
        });

        header.onclick = () => {
            section.classList.toggle('collapsed');
        };

        section.appendChild(header);
        section.appendChild(controls);
        section.appendChild(grid);
        categoriesContainer.appendChild(section);
    }

    function addGroupedCategory(categoryKey, categoryName, groups) {
        const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
        const section = document.createElement('div');
        section.className = 'category-section collapsed';
        section.dataset.category = categoryKey;

        const header = document.createElement('div');
        header.className = 'category-header';
        const titleDiv = document.createElement('div');
        titleDiv.className = 'category-title';
        titleDiv.innerHTML = `${categoryName} <span class="category-count">(${totalItems} items)</span>`;
        const icon = document.createElement('span');
        icon.className = 'collapse-icon';
        icon.textContent = '▼';
        header.appendChild(titleDiv);
        header.appendChild(icon);

        const controls = document.createElement('div');
        controls.className = 'category-controls';
        const selectBtn = document.createElement('button');
        selectBtn.className = 'category-btn';
        selectBtn.textContent = 'Select All';
        selectBtn.onclick = (e) => { e.stopPropagation(); section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true); };
        const deselectBtn = document.createElement('button');
        deselectBtn.className = 'category-btn';
        deselectBtn.textContent = 'Deselect All';
        deselectBtn.onclick = (e) => { e.stopPropagation(); section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false); };
        controls.appendChild(selectBtn);
        controls.appendChild(deselectBtn);

        const grid = document.createElement('div');
        grid.className = 'options-grid';

        groups.forEach(group => {
            const groupHeader = document.createElement('div');
            groupHeader.className = 'skill-group-header';
            groupHeader.textContent = group.label;
            grid.appendChild(groupHeader);
            group.items.forEach(item => addOption(grid, categoryKey, item.name, item.name));
        });

        header.addEventListener('click', () => section.classList.toggle('collapsed'));
        section.appendChild(header);
        section.appendChild(controls);
        section.appendChild(grid);
        categoriesContainer.appendChild(section);
    }

    function addOption(container, category, id, label, url = null) {
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
        
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.textContent = label;
            link.onclick = (e) => e.stopPropagation();
            labelEl.appendChild(link);
        } else {
            labelEl.textContent = label;
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
