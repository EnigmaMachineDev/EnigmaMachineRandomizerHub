document.addEventListener('DOMContentLoaded', () => {
    const methodRollEl = document.getElementById('method-roll');
    const proteinRollEl = document.getElementById('protein-roll');
    const vegetableRollEl = document.getElementById('vegetable-roll');
    const side1RollEl = document.getElementById('side1-roll');
    const side2RollEl = document.getElementById('side2-roll');
    
    const rerollMethodBtn = document.getElementById('reroll-method');
    const rerollProteinBtn = document.getElementById('reroll-protein');
    const rerollVegetableBtn = document.getElementById('reroll-vegetable');
    const rerollSide1Btn = document.getElementById('reroll-side1');
    const rerollSide2Btn = document.getElementById('reroll-side2');
    const generateMealBtn = document.getElementById('generate-meal');

    let data = {};
    const STORAGE_KEY = 'cookingOptions';
    const DIETARY_MODE_KEY = 'cookingDietaryMode';
    let options = {};
    let dietaryMode = 'normal';

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            loadDietaryMode();
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

    function loadDietaryMode() {
        const saved = localStorage.getItem(DIETARY_MODE_KEY);
        if (saved) {
            dietaryMode = saved;
        }
    }

    function isEnabled(sectionName, itemName) {
        if (!options[sectionName]) return true;
        if (!options[sectionName].hasOwnProperty(itemName)) return true;
        return options[sectionName][itemName];
    }

    function getEnabledOptions(sectionName) {
        const section = data.sections?.find(s => s.name === sectionName);
        if (!section || !section.options) return [];
        return section.options.filter(opt => isEnabled(sectionName, opt));
    }

    function getEnabledSubsectionOptions(sectionName, subsectionName) {
        const section = data.sections?.find(s => s.name === sectionName);
        if (!section || !section.subsections) return [];
        const subsection = section.subsections.find(sub => sub.name === subsectionName);
        if (!subsection || !subsection.options) return [];
        return subsection.options.filter(opt => isEnabled(`${sectionName}_${subsectionName}`, opt));
    }

    function getAllEnabledProteinOptions() {
        const section = data.sections?.find(s => s.name === 'Protein');
        if (!section || !section.subsections) return [];
        
        let allOptions = [];
        section.subsections.forEach(subsection => {
            const enabledOptions = getEnabledSubsectionOptions('Protein', subsection.name);
            enabledOptions.forEach(opt => {
                allOptions.push({ subsection: subsection.name, option: opt });
            });
        });
        return allOptions;
    }

    function filterProteinByDietaryMode(proteinOptions) {
        if (dietaryMode === 'normal') return proteinOptions;
        
        const meatSubsections = ['Chicken', 'Turkey', 'Beef', 'Pork', 'Lamb', 'Duck', 'Game Meat', 'Fish', 'Shellfish'];
        const vegetarianSubsections = ['Eggs', 'Tofu', 'Plant-Based Protein', 'Beans', 'Lentils', 'Seeds'];
        const veganSubsections = ['Tofu', 'Plant-Based Protein', 'Beans', 'Lentils', 'Seeds'];
        
        if (dietaryMode === 'vegan') {
            return proteinOptions.filter(p => veganSubsections.includes(p.subsection));
        } else if (dietaryMode === 'vegetarian') {
            return proteinOptions.filter(p => vegetarianSubsections.includes(p.subsection));
        } else if (dietaryMode === 'carnivore') {
            return proteinOptions.filter(p => meatSubsections.includes(p.subsection));
        }
        
        return proteinOptions;
    }

    function setMethod() {
        const enabledMethods = getEnabledOptions('Cooking Method');
        if (enabledMethods.length === 0) {
            methodRollEl.textContent = 'No cooking methods enabled';
            return;
        }
        const method = getRandomValue(enabledMethods);
        methodRollEl.textContent = method;
    }

    function setProtein() {
        let proteinOptions = getAllEnabledProteinOptions();
        proteinOptions = filterProteinByDietaryMode(proteinOptions);
        
        if (proteinOptions.length === 0) {
            proteinRollEl.textContent = 'No proteins enabled for current dietary mode';
            return;
        }
        
        const protein = getRandomValue(proteinOptions);
        proteinRollEl.textContent = `${protein.subsection} - ${protein.option}`;
    }

    function setVegetable() {
        if (dietaryMode === 'carnivore') {
            vegetableRollEl.textContent = 'N/A (Carnivore Mode)';
            return;
        }
        
        const enabledVegetables = getEnabledOptions('Vegetable');
        if (enabledVegetables.length === 0) {
            vegetableRollEl.textContent = 'No vegetables enabled';
            return;
        }
        const vegetable = getRandomValue(enabledVegetables);
        vegetableRollEl.textContent = vegetable;
    }

    function getAvailableSideCategories() {
        let sideCategories = ['Protein', 'Dairy', 'Fruit', 'Grain', 'Nut'];
        
        if (dietaryMode === 'vegan') {
            sideCategories = sideCategories.filter(cat => cat !== 'Dairy');
        } else if (dietaryMode === 'carnivore') {
            sideCategories = sideCategories.filter(cat => cat === 'Dairy' || cat === 'Protein');
        }
        
        return sideCategories.filter(cat => {
            if (cat === 'Protein') {
                let proteinOptions = getAllEnabledProteinOptions();
                proteinOptions = filterProteinByDietaryMode(proteinOptions);
                return proteinOptions.length > 0;
            }
            return getEnabledOptions(cat).length > 0;
        });
    }

    function setSide(sideElement) {
        const availableCategories = getAvailableSideCategories();
        
        if (availableCategories.length === 0) {
            sideElement.textContent = 'No side options enabled for current dietary mode';
            return;
        }
        
        const category = getRandomValue(availableCategories);
        
        if (category === 'Protein') {
            let proteinOptions = getAllEnabledProteinOptions();
            proteinOptions = filterProteinByDietaryMode(proteinOptions);
            const protein = getRandomValue(proteinOptions);
            sideElement.innerHTML = `<strong>${category}:</strong> ${protein.subsection} - ${protein.option}`;
        } else {
            const enabledOptions = getEnabledOptions(category);
            const side = getRandomValue(enabledOptions);
            sideElement.innerHTML = `<strong>${category}:</strong> ${side}`;
        }
    }

    function randomizeAll() {
        setMethod();
        setProtein();
        setVegetable();
        setSide(side1RollEl);
        setSide(side2RollEl);
    }

    rerollMethodBtn.addEventListener('click', setMethod);
    rerollProteinBtn.addEventListener('click', setProtein);
    rerollVegetableBtn.addEventListener('click', setVegetable);
    rerollSide1Btn.addEventListener('click', () => setSide(side1RollEl));
    rerollSide2Btn.addEventListener('click', () => setSide(side2RollEl));
    generateMealBtn.addEventListener('click', randomizeAll);
});
