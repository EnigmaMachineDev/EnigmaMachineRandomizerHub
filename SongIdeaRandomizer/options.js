document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const saveMessage = document.getElementById('save-message');
    const bpmMinSlider = document.getElementById('bpm-min');
    const bpmMaxSlider = document.getElementById('bpm-max');
    const bpmMinValue = document.getElementById('bpm-min-value');
    const bpmMaxValue = document.getElementById('bpm-max-value');
    const resetBpmBtn = document.getElementById('reset-bpm');
    
    const BPM_DEFAULT_MIN = 20;
    const BPM_DEFAULT_MAX = 320;
    const STORAGE_KEY = 'songIdeaOptions';
    const JSON_FILE = 'randomizer.json';

    // Friendly display names for JSON keys
    const categoryDisplayNames = {
        'time_signatures': 'Time Signatures',
        'root_notes': 'Root Notes',
        'modes': 'Modes / Scales',
        'genres': 'Genres',
        'focus_instruments': 'Focus Instruments',
        'song_structures': 'Song Structures',
        'chord_progressions': 'Chord Progressions',
        'moods': 'Moods'
    };

    // Categories to show in options (skip bpm and structure_legend)
    const optionCategories = [
        'time_signatures',
        'root_notes',
        'modes',
        'genres',
        'moods',
        'focus_instruments',
        'chord_progressions',
        'song_structures'
    ];

    // BPM slider event listeners
    bpmMinSlider.addEventListener('input', () => {
        let val = parseInt(bpmMinSlider.value);
        if (val > parseInt(bpmMaxSlider.value)) {
            val = parseInt(bpmMaxSlider.value);
            bpmMinSlider.value = val;
        }
        bpmMinValue.textContent = val;
    });

    bpmMaxSlider.addEventListener('input', () => {
        let val = parseInt(bpmMaxSlider.value);
        if (val < parseInt(bpmMinSlider.value)) {
            val = parseInt(bpmMinSlider.value);
            bpmMaxSlider.value = val;
        }
        bpmMaxValue.textContent = val;
    });

    resetBpmBtn.addEventListener('click', () => {
        bpmMinSlider.value = BPM_DEFAULT_MIN;
        bpmMaxSlider.value = BPM_DEFAULT_MAX;
        bpmMinValue.textContent = BPM_DEFAULT_MIN;
        bpmMaxValue.textContent = BPM_DEFAULT_MAX;
    });

    fetch(JSON_FILE)
        .then(res => res.json())
        .then(data => {
            initializeOptions(data);
            loadSavedOptions();
        })
        .catch(error => console.error('Error loading options:', error));

    function initializeOptions(data) {
        optionCategories.forEach(categoryKey => {
            const categoryData = data[categoryKey];
            if (Array.isArray(categoryData) && categoryData.length > 0) {
                const displayName = categoryDisplayNames[categoryKey] || categoryKey;
                addCategory(categoryKey, displayName, categoryData);
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
        titleDiv.innerHTML = categoryName + ' <span class="category-count">(' + items.length + ' items)</span>';
        
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
        selectCategoryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        });
        
        const deselectCategoryBtn = document.createElement('button');
        deselectCategoryBtn.className = 'category-btn';
        deselectCategoryBtn.textContent = 'Deselect All';
        deselectCategoryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            section.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        });
        
        controls.appendChild(selectCategoryBtn);
        controls.appendChild(deselectCategoryBtn);

        const grid = document.createElement('div');
        grid.className = 'options-grid';

        items.forEach(item => {
            const itemName = typeof item === 'object' ? (item.name || item) : item;
            addOption(grid, categoryKey, itemName, itemName);
        });

        header.addEventListener('click', () => {
            section.classList.toggle('collapsed');
        });

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
        checkbox.id = 'opt-' + category + '-' + id.replace(/[^a-zA-Z0-9]/g, '-');
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
                // Load BPM range
                if (options.bpm_range) {
                    bpmMinSlider.value = options.bpm_range.min || BPM_DEFAULT_MIN;
                    bpmMaxSlider.value = options.bpm_range.max || BPM_DEFAULT_MAX;
                    bpmMinValue.textContent = bpmMinSlider.value;
                    bpmMaxValue.textContent = bpmMaxSlider.value;
                }
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
        // Save BPM range
        options.bpm_range = {
            min: parseInt(bpmMinSlider.value),
            max: parseInt(bpmMaxSlider.value)
        };
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
            bpmMinSlider.value = BPM_DEFAULT_MIN;
            bpmMaxSlider.value = BPM_DEFAULT_MAX;
            bpmMinValue.textContent = BPM_DEFAULT_MIN;
            bpmMaxValue.textContent = BPM_DEFAULT_MAX;
            saveOptions();
        }
    });
});
