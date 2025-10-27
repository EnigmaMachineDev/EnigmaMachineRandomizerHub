document.addEventListener('DOMContentLoaded', () => {
    const bakeRollEl = document.getElementById('bake-roll');
    const rerollBakeBtn = document.getElementById('reroll-bake');
    const generateBakeBtn = document.getElementById('generate-bake');

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

    function setBake() {
        // Define all baking categories
        const categories = ['breads', 'pastries', 'cakes', 'cookies', 'pies_and_tarts', 'bars_and_brownies', 'other_desserts'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        const bakeObj = getRandomValue(data[category]);
        
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
