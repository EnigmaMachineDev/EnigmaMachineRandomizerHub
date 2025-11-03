document.addEventListener('DOMContentLoaded', () => {
    const teaRollEl = document.getElementById('tea-roll');
    const rerollTeaBtn = document.getElementById('reroll-tea');
    const generateTeaBtn = document.getElementById('generate-tea');

    let data = {};
    const STORAGE_KEY = 'teaOptions';
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

    function setTea() {
        const categories = ['green_teas', 'black_teas', 'oolong_teas', 'white_teas', 'pu_erh_teas', 'herbal_teas', 'specialty_blends'];
        const availableCategories = categories.filter(cat => getEnabledItems(cat).length > 0);
        if (availableCategories.length === 0) {
            teaRollEl.innerHTML = '<p>No teas enabled. Please enable some options.</p>';
            return;
        }
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const enabledItems = getEnabledItems(category);
        const teaObj = getRandomValue(enabledItems);
        
        let result = `<div class="tea-recipe">`;
        result += `<h3>${teaObj.name}</h3>`;
        
        if (teaObj.origin) {
            result += `<p><strong>Origin:</strong> ${teaObj.origin}</p>`;
        }
        
        if (teaObj.description) {
            result += `<p class="description"><strong>Description:</strong> ${teaObj.description}</p>`;
        }
        
        if (teaObj.brew_temp) {
            result += `<p><strong>Brew Temperature:</strong> ${teaObj.brew_temp}</p>`;
        }
        
        if (teaObj.brew_time) {
            result += `<p><strong>Brew Time:</strong> ${teaObj.brew_time}</p>`;
        }
        
        if (teaObj.caffeine) {
            result += `<p><strong>Caffeine:</strong> ${teaObj.caffeine}</p>`;
        }
        
        if (teaObj.oxidation) {
            result += `<p><strong>Oxidation Level:</strong> ${teaObj.oxidation}</p>`;
        }
        
        if (teaObj.ingredients) {
            result += `<p><strong>Ingredients:</strong></p><ul>`;
            teaObj.ingredients.forEach(ingredient => {
                result += `<li>${ingredient}</li>`;
            });
            result += `</ul>`;
        }
        
        if (teaObj.instructions) {
            result += `<p><strong>Instructions:</strong> ${teaObj.instructions}</p>`;
        }
        
        if (teaObj.info_url) {
            result += `<p class="info-link"><strong>Learn More:</strong> <a href="${teaObj.info_url}" target="_blank" rel="noopener noreferrer">Read about ${teaObj.name}</a></p>`;
        }
        
        result += `</div>`;
        
        teaRollEl.innerHTML = result;
    }

    function randomizeAll() {
        setTea();
    }

    rerollTeaBtn.addEventListener('click', setTea);
    generateTeaBtn.addEventListener('click', randomizeAll);
});
