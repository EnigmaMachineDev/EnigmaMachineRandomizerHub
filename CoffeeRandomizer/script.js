document.addEventListener('DOMContentLoaded', () => {
    const coffeeRollEl = document.getElementById('coffee-roll');
    const rerollCoffeeBtn = document.getElementById('reroll-coffee');
    const generateCoffeeBtn = document.getElementById('generate-coffee');

    let data = {};
    const STORAGE_KEY = 'coffeeOptions';
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
            try {
                options = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading options:', e);
                options = {};
            }
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

    function setCoffee() {
        // Define main coffee categories
        const categories = ['brewing_methods', 'espresso_based_drinks', 'cold_coffee_drinks', 'specialty_coffee_drinks', 'flavored_variations'];
        
        // Filter to categories that have enabled items
        const availableCategories = categories.filter(cat => getEnabledItems(cat).length > 0);
        if (availableCategories.length === 0) {
            coffeeRollEl.innerHTML = '<p>No coffee recipes enabled. Please enable some options.</p>';
            return;
        }
        
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const enabledItems = getEnabledItems(category);
        const coffeeObj = getRandomValue(enabledItems);
        
        let result = `<div class="coffee-recipe">`;
        result += `<h3>${coffeeObj.name}</h3>`;
        
        if (coffeeObj.description) {
            result += `<p class="description"><strong>Description:</strong> ${coffeeObj.description}</p>`;
        }
        
        if (coffeeObj.base) {
            result += `<p><strong>Base:</strong> ${coffeeObj.base}</p>`;
        }
        
        if (coffeeObj.brew_time) {
            result += `<p><strong>Brew Time:</strong> ${coffeeObj.brew_time}</p>`;
        }
        
        if (coffeeObj.difficulty) {
            result += `<p><strong>Difficulty:</strong> ${coffeeObj.difficulty}</p>`;
        }
        
        if (coffeeObj.grind_size) {
            result += `<p><strong>Grind Size:</strong> ${coffeeObj.grind_size}</p>`;
        }
        
        if (coffeeObj.ratio) {
            result += `<p><strong>Ratio:</strong> ${coffeeObj.ratio}</p>`;
        }
        
        if (coffeeObj.popular_devices) {
            result += `<p><strong>Popular Devices:</strong> ${coffeeObj.popular_devices.join(', ')}</p>`;
        }
        
        if (coffeeObj.ingredients) {
            result += `<p><strong>Ingredients:</strong></p><ul>`;
            coffeeObj.ingredients.forEach(ingredient => {
                result += `<li>${ingredient}</li>`;
            });
            result += `</ul>`;
        }
        
        if (coffeeObj.instructions) {
            result += `<p><strong>Instructions:</strong> ${coffeeObj.instructions}</p>`;
        }
        
        if (coffeeObj.flavoring) {
            result += `<p><strong>Flavoring:</strong> ${coffeeObj.flavoring}</p>`;
        }
        
        result += `</div>`;
        
        coffeeRollEl.innerHTML = result;
    }

    function randomizeAll() {
        setCoffee();
    }

    rerollCoffeeBtn.addEventListener('click', setCoffee);
    generateCoffeeBtn.addEventListener('click', randomizeAll);
});
