document.addEventListener('DOMContentLoaded', () => {
    const countryRollEl = document.getElementById('country-roll');
    const advisoryLevelEl = document.getElementById('advisory-level');
    const travelStatusEl = document.getElementById('travel-status');
    const rerollCountryBtn = document.getElementById('reroll-country');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data = {};
    const STORAGE_KEY = 'travelOptions';
    let options = {};

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

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
        return data[category].filter(item => {
            const name = item.name || item.destination || item;
            return isEnabled(category, name);
        });
    }

    function getAdvisoryText(level) {
        switch(level) {
            case 1:
                return 'Level 1: Exercise Normal Precautions';
            case 2:
                return 'Level 2: Exercise Increased Caution';
            case 3:
                return 'Level 3: Reconsider Travel';
            case 4:
                return 'Level 4: Do Not Travel';
            default:
                return 'Unknown Level';
        }
    }

    function getAdvisoryClass(level) {
        switch(level) {
            case 1:
                return 'level-1';
            case 2:
                return 'level-2';
            case 3:
                return 'level-3';
            case 4:
                return 'level-4';
            default:
                return '';
        }
    }

    function setCountry() {
        const enabledCountries = getEnabledItems('countries');
        if (enabledCountries.length === 0) {
            countryRollEl.innerHTML = '';
            const p = document.createElement('p');
            p.textContent = 'No countries enabled. Please enable some options.';
            countryRollEl.appendChild(p);
            advisoryLevelEl.textContent = '';
            travelStatusEl.textContent = '';
            return;
        }
        const country = getRandomValue(enabledCountries);
        
        // Create Wikipedia URL for the country
        const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(country.name.replace(/ /g, '_'))}`;
        
        // Display country name with link using DOM methods
        countryRollEl.innerHTML = '';
        const link = document.createElement('a');
        link.href = wikiUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'country-link';
        link.textContent = country.name;
        countryRollEl.appendChild(link);
        
        const advisoryText = getAdvisoryText(country.level);
        advisoryLevelEl.textContent = advisoryText;
        advisoryLevelEl.className = 'advisory-badge ' + getAdvisoryClass(country.level);
        
        travelStatusEl.textContent = country.safetyLevel;
        travelStatusEl.className = 'status-level-' + country.level;
    }

    function randomizeAll() {
        setCountry();
    }

    rerollCountryBtn.addEventListener('click', setCountry);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
