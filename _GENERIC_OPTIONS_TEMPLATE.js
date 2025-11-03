// GENERIC OPTIONS.JS TEMPLATE - Replace STORAGE_KEY value for each randomizer
document.addEventListener('DOMContentLoaded', () => {
    const optionsGrid = document.getElementById('options-grid');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const saveMessage = document.getElementById('save-message');
    const STORAGE_KEY = 'REPLACE_ME'; // e.g., 'travelOptions', 'bakingOptions'
    
    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            initializeOptions(data);
            loadSavedOptions();
        });
    
    function initializeOptions(data) {
        Object.keys(data).forEach(categoryKey => {
            if (Array.isArray(data[categoryKey]) && data[categoryKey].length > 0) {
                const categoryName = categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                addCategory(categoryName);
                data[categoryKey].forEach(item => {
                    const itemName = item.name || item;
                    addOption(categoryKey, itemName, itemName);
                });
            }
        });
    }
    
    function addCategory(name) {
        const header = document.createElement('div');
        header.className = 'category-header';
        header.textContent = name;
        optionsGrid.appendChild(header);
    }
    
    function addOption(category, id, label) {
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
        optionsGrid.appendChild(div);
    }
    
    function loadSavedOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const options = JSON.parse(saved);
                optionsGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    const category = cb.dataset.category;
                    const id = cb.dataset.id;
                    if (options[category]?.[id] !== undefined) cb.checked = options[category][id];
                });
            } catch (e) { console.error('Error loading options:', e); }
        }
    }
    
    function saveOptions() {
        const options = {};
        optionsGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            const category = cb.dataset.category;
            const id = cb.dataset.id;
            if (!options[category]) options[category] = {};
            options[category][id] = cb.checked;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
        saveMessage.classList.add('show');
        setTimeout(() => saveMessage.classList.remove('show'), 2000);
    }
    
    selectAllBtn.addEventListener('click', () => {
        optionsGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    });
    
    deselectAllBtn.addEventListener('click', () => {
        optionsGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    });
    
    saveBtn.addEventListener('click', () => {
        saveOptions();
        setTimeout(() => window.location.href = 'index.html', 500);
    });
    
    resetBtn.addEventListener('click', () => {
        if (confirm('Reset all options to defaults (all enabled)?')) {
            localStorage.removeItem(STORAGE_KEY);
            optionsGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
            saveOptions();
        }
    });
});
