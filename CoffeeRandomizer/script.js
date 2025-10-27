document.addEventListener('DOMContentLoaded', () => {
    const coffeeRollEl = document.getElementById('coffee-roll');
    const rerollCoffeeBtn = document.getElementById('reroll-coffee');
    const generateCoffeeBtn = document.getElementById('generate-coffee');

    let data = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            randomizeAll();
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function setCoffee() {
        // Define main coffee categories
        const categories = ['brewing_methods', 'espresso_based_drinks', 'cold_coffee_drinks', 'specialty_coffee_drinks', 'flavored_variations'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        const coffeeObj = getRandomValue(data[category]);
        
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
