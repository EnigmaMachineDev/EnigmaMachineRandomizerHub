document.addEventListener('DOMContentLoaded', () => {
    const teaRollEl = document.getElementById('tea-roll');
    const rerollTeaBtn = document.getElementById('reroll-tea');
    const generateTeaBtn = document.getElementById('generate-tea');

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

    function setTea() {
        // Define main tea categories
        const categories = ['green_teas', 'black_teas', 'oolong_teas', 'white_teas', 'pu_erh_teas', 'herbal_teas', 'specialty_blends'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        const teaObj = getRandomValue(data[category]);
        
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
