document.addEventListener('DOMContentLoaded', () => {
    const baseRollEl = document.getElementById('base-roll');
    const proteinRollEl = document.getElementById('protein-roll');
    const sauceRollEl = document.getElementById('sauce-roll');
    const toppingsRollEl = document.getElementById('toppings-roll');
    const crunchRollEl = document.getElementById('crunch-roll');
    const extraRollEl = document.getElementById('extra-roll');

    const rerollBaseBtn = document.getElementById('reroll-base');
    const rerollProteinBtn = document.getElementById('reroll-protein');
    const rerollSauceBtn = document.getElementById('reroll-sauce');
    const rerollToppingsBtn = document.getElementById('reroll-toppings');
    const rerollCrunchBtn = document.getElementById('reroll-crunch');
    const rerollExtraBtn = document.getElementById('reroll-extra');
    const generateBowlBtn = document.getElementById('generate-bowl');

    const STORAGE_KEY = 'pokeBowlOptions';
    const DIETARY_MODE_KEY = 'pokeBowlDietaryMode';
    const TOPPING_COUNT = 3;

    let data = {};
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

    function getRandomUniqueValues(arr, count) {
        const shuffled = arr.slice().sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, arr.length));
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

        const plantBasedSubsections = ['Plant-Based'];
        const vegetarianSubsections = ['Plant-Based'];
        const fishSubsections = ['Fish'];

        if (dietaryMode === 'vegan') {
            return proteinOptions.filter(p => plantBasedSubsections.includes(p.subsection));
        } else if (dietaryMode === 'vegetarian') {
            return proteinOptions.filter(p => vegetarianSubsections.includes(p.subsection));
        } else if (dietaryMode === 'pescatarian') {
            return proteinOptions.filter(p => fishSubsections.includes(p.subsection) || plantBasedSubsections.includes(p.subsection));
        }

        return proteinOptions;
    }

    function setBase() {
        const enabledBases = getEnabledOptions('Base');
        if (enabledBases.length === 0) {
            baseRollEl.textContent = 'No bases enabled';
            return;
        }
        baseRollEl.textContent = getRandomValue(enabledBases);
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

    function setSauce() {
        const enabledSauces = getEnabledOptions('Sauce');
        if (enabledSauces.length === 0) {
            sauceRollEl.textContent = 'No sauces enabled';
            return;
        }
        sauceRollEl.textContent = getRandomValue(enabledSauces);
    }

    function setToppings() {
        const enabledToppings = getEnabledOptions('Toppings');
        if (enabledToppings.length === 0) {
            toppingsRollEl.innerHTML = '<li>No toppings enabled</li>';
            return;
        }

        const selected = getRandomUniqueValues(enabledToppings, TOPPING_COUNT);
        toppingsRollEl.innerHTML = '';
        selected.forEach(topping => {
            const li = document.createElement('li');
            li.textContent = topping;
            toppingsRollEl.appendChild(li);
        });
    }

    function setCrunch() {
        const enabledCrunches = getEnabledOptions('Crunch');
        if (enabledCrunches.length === 0) {
            crunchRollEl.textContent = 'No crunch options enabled';
            return;
        }
        crunchRollEl.textContent = getRandomValue(enabledCrunches);
    }

    function setExtra() {
        const enabledExtras = getEnabledOptions('Extra');
        if (enabledExtras.length === 0) {
            extraRollEl.textContent = 'No extras enabled';
            return;
        }
        extraRollEl.textContent = getRandomValue(enabledExtras);
    }

    function randomizeAll() {
        setBase();
        setProtein();
        setSauce();
        setToppings();
        setCrunch();
        setExtra();
    }

    rerollBaseBtn.addEventListener('click', setBase);
    rerollProteinBtn.addEventListener('click', setProtein);
    rerollSauceBtn.addEventListener('click', setSauce);
    rerollToppingsBtn.addEventListener('click', setToppings);
    rerollCrunchBtn.addEventListener('click', setCrunch);
    rerollExtraBtn.addEventListener('click', setExtra);
    generateBowlBtn.addEventListener('click', randomizeAll);

    function copyResults() {
        const sections = document.querySelectorAll('.container > .section');
        const lines = [];
        sections.forEach(section => {
            if (section.style.display === 'none') return;
            const header = section.querySelector('.section-header h2');
            if (!header) return;
            const label = header.textContent.trim();
            const itemContainer = section.querySelector('.item-container');
            if (!itemContainer) return;
            // Check for list items
            const listItems = itemContainer.querySelectorAll('li');
            let value = '';
            if (listItems.length > 0) {
                const items = Array.from(listItems).map(li => li.textContent.trim());
                value = items.join(', ');
            } else {
                value = itemContainer.textContent.trim();
            }
            if (value) {
                lines.push(label + ': ' + value);
            }
        });
        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-results');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
    }

    document.getElementById('copy-results').addEventListener('click', copyResults);
});
