document.addEventListener('DOMContentLoaded', () => {
    const bakeRollEl = document.getElementById('bake-roll');
    const rerollBakeBtn = document.getElementById('reroll-bake');
    const generateBakeBtn = document.getElementById('generate-bake');

    let data = {};
    const STORAGE_KEY = 'bakingOptions';
    let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { options = JSON.parse(saved); }
            catch (e) { options = {}; }
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

    function setBake() {
        const categories = ['breads', 'pastries', 'cakes', 'cookies', 'pies_and_tarts', 'bars_and_brownies', 'other_desserts'];
        const availableCategories = categories.filter(cat => getEnabledItems(cat).length > 0);
        if (availableCategories.length === 0) {
            bakeRollEl.innerHTML = '<p>No baked goods enabled. Please enable some options.</p>';
            return;
        }
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const enabledItems = getEnabledItems(category);
        const bakeObj = getRandomValue(enabledItems);
        
        let result = `<div class="bake-item">`;
        result += `<h3>${bakeObj.name}</h3>`;
        
        if (bakeObj.description) {
            result += `<p class="description">${bakeObj.description}</p>`;
        }
        
        if (bakeObj.category) {
            result += `<p class="category"><strong>Category:</strong> ${bakeObj.category}</p>`;
        }
        
        if (bakeObj.info_url) {
            result += `<p class="info-link"><strong>Learn More:</strong> <a href="${bakeObj.info_url}" target="_blank" rel="noopener noreferrer">Read about ${bakeObj.name}</a></p>`;
        }
        
        result += `</div>`;
        
        bakeRollEl.innerHTML = result;
    }

    function randomizeAll() {
        setBake();
    }

    rerollBakeBtn.addEventListener('click', setBake);
    generateBakeBtn.addEventListener('click', randomizeAll);
});
