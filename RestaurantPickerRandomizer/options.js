document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('restaurants-container');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const saveBtn = document.getElementById('save-options');
    const resetBtn = document.getElementById('reset-options');
    const saveMessage = document.getElementById('save-message');
    let STORAGE_KEY = 'restaurantPickerOptions';

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            STORAGE_KEY = data.storageKey || STORAGE_KEY;
            if (data.title) document.title = data.title + ' - Options';
            renderOptions(data.restaurants);
            loadSavedOptions();
        });

    function renderOptions(restaurants) {
        restaurants.forEach(r => {
            const div = document.createElement('div');
            div.className = 'option-item';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = 'opt-' + r.name.replace(/[^a-zA-Z0-9]/g, '-');
            cb.checked = true;
            cb.dataset.name = r.name;
            const label = document.createElement('label');
            label.htmlFor = cb.id;
            label.textContent = r.name;
            div.appendChild(cb);
            div.appendChild(label);
            container.appendChild(div);
        });
    }

    function loadSavedOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        try {
            const opts = JSON.parse(saved);
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                if (opts.restaurants && opts.restaurants[cb.dataset.name] !== undefined) {
                    cb.checked = opts.restaurants[cb.dataset.name];
                }
            });
        } catch (e) {}
    }

    function saveOptions() {
        const opts = { restaurants: {} };
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            opts.restaurants[cb.dataset.name] = cb.checked;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(opts));
        saveMessage.classList.add('show');
        setTimeout(() => saveMessage.classList.remove('show'), 2000);
    }

    selectAllBtn.addEventListener('click', () => document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true));
    deselectAllBtn.addEventListener('click', () => document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false));
    saveBtn.addEventListener('click', () => { saveOptions(); setTimeout(() => window.location.href = 'index.html', 500); });
    resetBtn.addEventListener('click', () => {
        if (confirm('Reset all options to defaults (all enabled)?')) {
            localStorage.removeItem(STORAGE_KEY);
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
            saveOptions();
        }
    });
});
