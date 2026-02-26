document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const saveMessage = document.getElementById('save-message');
    let STORAGE_KEY = 'restaurantOptions';

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            STORAGE_KEY = data.storageKey || 'restaurantOptions';
            if (data.restaurant) {
                document.title = data.restaurant + ' Randomizer - Options';
            }
            initializeOptions(data);
            loadSavedOptions();
        });

    function initializeOptions(data) {
        data.sections.forEach(section => {
            addCategory(section.name, section.name, section.items);
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
        titleDiv.innerHTML = categoryName + ' <span class="category-count">(' + items.length + ' items)</span>';
        const icon = document.createElement('span');
        icon.className = 'collapse-icon';
        icon.textContent = '\u25BC';
        header.appendChild(titleDiv);
        header.appendChild(icon);
        const controls = document.createElement('div');
        controls.className = 'category-controls';
        const selectCatBtn = document.createElement('button');
        selectCatBtn.className = 'category-btn';
        selectCatBtn.textContent = 'Select All';
        selectCatBtn.onclick = (e) => { e.stopPropagation(); section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true); };
        const deselectCatBtn = document.createElement('button');
        deselectCatBtn.className = 'category-btn';
        deselectCatBtn.textContent = 'Deselect All';
        deselectCatBtn.onclick = (e) => { e.stopPropagation(); section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false); };
        controls.appendChild(selectCatBtn);
        controls.appendChild(deselectCatBtn);
        const grid = document.createElement('div');
        grid.className = 'options-grid';
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'option-item';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = 'opt-' + categoryKey.replace(/[^a-zA-Z0-9]/g, '-') + '-' + item.replace(/[^a-zA-Z0-9]/g, '-');
            cb.checked = true;
            cb.dataset.category = categoryKey;
            cb.dataset.id = item;
            const label = document.createElement('label');
            label.htmlFor = cb.id;
            label.textContent = item;
            div.appendChild(cb);
            div.appendChild(label);
            grid.appendChild(div);
        });
        header.onclick = () => section.classList.toggle('collapsed');
        section.appendChild(header);
        section.appendChild(controls);
        section.appendChild(grid);
        categoriesContainer.appendChild(section);
    }

    function loadSavedOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const opts = JSON.parse(saved);
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (opts[cb.dataset.category] && opts[cb.dataset.category][cb.dataset.id] !== undefined) {
                        cb.checked = opts[cb.dataset.category][cb.dataset.id];
                    }
                });
            } catch (e) { console.error('Error loading options:', e); }
        }
    }

    function saveOptions() {
        const opts = {};
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (!opts[cb.dataset.category]) opts[cb.dataset.category] = {};
            opts[cb.dataset.category][cb.dataset.id] = cb.checked;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(opts));
        showSaveMessage();
    }

    function showSaveMessage() {
        saveMessage.classList.add('show');
        setTimeout(() => saveMessage.classList.remove('show'), 2000);
    }

    selectAllBtn.addEventListener('click', () => document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true));
    deselectAllBtn.addEventListener('click', () => document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false));
    expandAllBtn.addEventListener('click', () => document.querySelectorAll('.category-section').forEach(s => s.classList.remove('collapsed')));
    collapseAllBtn.addEventListener('click', () => document.querySelectorAll('.category-section').forEach(s => s.classList.add('collapsed')));
    saveBtn.addEventListener('click', () => { saveOptions(); setTimeout(() => window.location.href = 'index.html', 500); });
    resetBtn.addEventListener('click', () => {
        if (confirm('Reset all options to defaults (all enabled)?')) {
            localStorage.removeItem(STORAGE_KEY);
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
            saveOptions();
        }
    });
});
