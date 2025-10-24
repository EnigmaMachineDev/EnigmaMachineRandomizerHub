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

    function generatePeppers() {
        if (!peppersData || peppersData.length === 0) return;

        // Choose between 1 and 2 peppers
        const numberOfPeppers = Math.floor(Math.random() * 2) + 1;
        const selectedPeppers = [];
        const peppersCopy = [...peppersData];

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

        // Choose between 2 and 5 vegetables
        const numberOfVegetables = Math.floor(Math.random() * 4) + 2;
        const selectedVegetables = [];
        const vegetablesCopy = [...vegetablesData];

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
        const fermentationOptions = [
            'Fresh Fermented',
            'Roasted Fermented',
            'Fresh Non-Fermented',
            'Roasted Non-Fermented'
        ];
        const selectedOption = getRandomElement(fermentationOptions);
        fermentationEl.textContent = selectedOption;
    }

    function randomizeAll() {
        generatePeppers();
        generateVegetables();
        generateFermentation();
    }

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            // Flatten all pepper categories into a single array
            if (data.peppers) {
                peppersData = [
                    ...(data.peppers.mild_to_medium || []),
                    ...(data.peppers.medium_to_hot || []),
                    ...(data.peppers.hot_to_very_hot || []),
                    ...(data.peppers.extremely_hot || [])
                ];
            }
            
            vegetablesData = data.vegetables || [];

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
