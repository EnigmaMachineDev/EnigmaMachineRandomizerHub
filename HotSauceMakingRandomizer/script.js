document.addEventListener('DOMContentLoaded', () => {
    const peppersListEl = document.getElementById('peppers-list');
    const vegetablesListEl = document.getElementById('vegetables-list');
    const fermentationEl = document.getElementById('fermentation');

    const rerollPeppersBtn = document.getElementById('reroll-peppers');
    const rerollVegetablesBtn = document.getElementById('reroll-vegetables');
    const rerollFermentationBtn = document.getElementById('reroll-fermentation');
    const generateRecipeBtn = document.getElementById('generate-recipe');

    let peppersData = [];
    let vegetablesData = [];

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const STORAGE_KEY = 'hotSauceOptions';
    let options = {};
    let data = {};

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
        return data[category].filter(item => {
            // Handle both string arrays and object arrays
            const itemName = typeof item === 'string' ? item : item.name;
            return isEnabled(category, itemName);
        });
    }

    function generatePeppers() {
        if (!peppersData || peppersData.length === 0) return;

        const enabledPeppers = getEnabledItems('peppers');
        if (enabledPeppers.length === 0) {
            peppersListEl.innerHTML = '<li>No peppers selected</li>';
            return;
        }

        // Choose between 1 and 3 peppers
        const numberOfPeppers = Math.min(Math.floor(Math.random() * 3) + 1, enabledPeppers.length);
        const selectedPeppers = [];
        const peppersCopy = [...enabledPeppers];

        for (let i = 0; i < numberOfPeppers; i++) {
            if (peppersCopy.length === 0) break;
            const randomIndex = Math.floor(Math.random() * peppersCopy.length);
            selectedPeppers.push(peppersCopy.splice(randomIndex, 1)[0]);
        }

        peppersListEl.innerHTML = '';
        selectedPeppers.forEach(pepper => {
            const li = document.createElement('li');
            const shuRange = pepper.shu_min === pepper.shu_max 
                ? `${pepper.shu_min.toLocaleString()} SHU`
                : `${pepper.shu_min.toLocaleString()} - ${pepper.shu_max.toLocaleString()} SHU`;
            li.innerHTML = `<a href="${pepper.info_url}" target="_blank">${pepper.name}</a> <span class="shu-info">(${shuRange})</span>`;
            peppersListEl.appendChild(li);
        });
    }

    function generateVegetables() {
        if (!vegetablesData || vegetablesData.length === 0) return;

        const enabledVegetables = getEnabledItems('vegetables');
        if (enabledVegetables.length === 0) {
            vegetablesListEl.innerHTML = '<li>No vegetables selected</li>';
            return;
        }

        // Choose between 2 and 5 vegetables
        const numberOfVegetables = Math.min(Math.floor(Math.random() * 4) + 2, enabledVegetables.length);
        const selectedVegetables = [];
        const vegetablesCopy = [...enabledVegetables];

        for (let i = 0; i < numberOfVegetables; i++) {
            if (vegetablesCopy.length === 0) break;
            const randomIndex = Math.floor(Math.random() * vegetablesCopy.length);
            selectedVegetables.push(vegetablesCopy.splice(randomIndex, 1)[0]);
        }

        vegetablesListEl.innerHTML = '';
        selectedVegetables.forEach(vegetable => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${vegetable.info_url}" target="_blank">${vegetable.name}</a> <span class="description">(${vegetable.description})</span>`;
            vegetablesListEl.appendChild(li);
        });
    }

    function generateFermentation() {
        const enabledFermentation = getEnabledItems('fermentation');
        if (enabledFermentation.length === 0) {
            fermentationEl.textContent = 'No fermentation options selected';
            return;
        }
        const selectedOption = getRandomElement(enabledFermentation);
        fermentationEl.textContent = selectedOption;
    }

    function randomizeAll() {
        generatePeppers();
        generateVegetables();
        generateFermentation();
    }

    fetch('randomizer.json')
        .then(res => res.json())
        .then(jsonData => {
            loadOptions();
            // Flatten all pepper categories into a single array
            if (jsonData.peppers) {
                peppersData = [
                    ...(jsonData.peppers.mild_to_medium || []),
                    ...(jsonData.peppers.medium_to_hot || []),
                    ...(jsonData.peppers.hot_to_very_hot || []),
                    ...(jsonData.peppers.extremely_hot || [])
                ];
            }
            
            vegetablesData = jsonData.vegetables || [];
            
            // Set up data object for filtering
            data = {
                peppers: peppersData,
                vegetables: vegetablesData,
                fermentation: jsonData.fermentation || []
            };

            randomizeAll();

            rerollPeppersBtn.addEventListener('click', generatePeppers);
            rerollVegetablesBtn.addEventListener('click', generateVegetables);
            rerollFermentationBtn.addEventListener('click', generateFermentation);
            generateRecipeBtn.addEventListener('click', randomizeAll);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Failed to load necessary data. Please check the console for more details and ensure the .json file is present and correctly formatted.');
        });
});
