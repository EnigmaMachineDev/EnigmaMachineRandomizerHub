document.addEventListener('DOMContentLoaded', () => {
    const countryRollEl = document.getElementById('country-roll');
    const advisoryLevelEl = document.getElementById('advisory-level');
    const travelStatusEl = document.getElementById('travel-status');
    const rerollCountryBtn = document.getElementById('reroll-country');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

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
        const country = getRandomValue(data.countries);
        
        // Create Wikipedia URL for the country
        const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(country.name.replace(/ /g, '_'))}`;
        
        // Display country name with link
        countryRollEl.innerHTML = `<a href="${wikiUrl}" target="_blank" rel="noopener noreferrer" class="country-link">${country.name}</a>`;
        
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
