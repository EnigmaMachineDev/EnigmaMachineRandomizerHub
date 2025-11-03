document.addEventListener('DOMContentLoaded', () => {
    const selectedClassEl = document.getElementById('selected-class');
    const generateClassBtn = document.getElementById('generate-class');
    const rerollClassBtn = document.getElementById('reroll-class');
    const checkboxContainer = document.getElementById('class-checkboxes');
    const selectAllBtn = document.getElementById('select-all-btn');
    const deselectAllBtn = document.getElementById('deselect-all-btn');

    let allClasses = [];
    let checkboxes = {};
    let data = {};
    const STORAGE_KEY = 'realmOfTheMadGodOptions';
    let options = {};

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) {}
        }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function getEnabledItems(category) {
        if (!data[category]) return [];
        return data[category].filter(item => isEnabled(category, item.name));
    }

    // Get enabled classes based on checkbox states
    function getEnabledClasses() {
        return allClasses.filter(className => checkboxes[className].checked);
    }

    // Generate a random class from enabled classes
    function generateClass() {
        const enabledClasses = getEnabledClasses();

        if (enabledClasses.length === 0) {
            selectedClassEl.textContent = 'Please enable at least one class';
            selectedClassEl.style.color = '#ff6666';
            return;
        }

        const randomClass = getRandomValue(enabledClasses);
        selectedClassEl.textContent = randomClass;
        selectedClassEl.style.color = '#66cc66';
    }

    // Create checkboxes for all classes
    function createCheckboxes() {
        checkboxContainer.innerHTML = '';

        allClasses.forEach(className => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `class-${className}`;
            checkbox.checked = isEnabled('classes', className); // Load checked state from localStorage
            checkboxes[className] = checkbox;

            const label = document.createElement('label');
            label.htmlFor = `class-${className}`;
            label.textContent = className;

            checkboxItem.appendChild(checkbox);
            checkboxItem.appendChild(label);
            checkboxContainer.appendChild(checkboxItem);

            // Make the entire item clickable
            checkboxItem.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            });

            // Save checkbox state to localStorage
            checkbox.addEventListener('change', () => {
                options.classes = options.classes || {};
                options.classes[className] = checkbox.checked;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
            });
        });
    }

    // Select all classes
    function selectAll() {
        allClasses.forEach(className => {
            checkboxes[className].checked = true;
        });
    }

    // Deselect all classes
    function deselectAll() {
        allClasses.forEach(className => {
            checkboxes[className].checked = false;
        });
    }

    // Load data from JSON
    fetch('randomizer.json')
        .then(res => res.json())
        .then(jsonData => {
            data = jsonData;
            allClasses = data.classes;
            loadOptions();
            createCheckboxes();
            generateClass();

            // Add event listeners
            generateClassBtn.addEventListener('click', generateClass);
            rerollClassBtn.addEventListener('click', generateClass);
            selectAllBtn.addEventListener('click', selectAll);
            deselectAllBtn.addEventListener('click', deselectAll);
        })
        .catch(error => console.error('Error loading data:', error));
});
