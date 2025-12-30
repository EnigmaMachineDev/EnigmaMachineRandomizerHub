document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-character');
    const rerollRaceBtn = document.getElementById('reroll-race');
    const rerollSkillsBtn = document.getElementById('reroll-skills');
    const rerollAllegiancesBtn = document.getElementById('reroll-allegiances');
    const rerollStartBtn = document.getElementById('reroll-start');
    const additionalStartsCheckbox = document.getElementById('additional-starts');

    const raceEl = document.getElementById('race');
    const skillsListEl = document.getElementById('skills-list');
    const allegiancesListEl = document.getElementById('allegiances-list');
    const startEl = document.getElementById('start');

    let data={};const STORAGE_KEY='skyrimOptions';let options={};
    let selectedRace = '';

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            generateCharacter();
        });

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) {}
        }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function getEnabledItems(category) {
        if (!data[category]) return [];
        // Handle arrays of strings
        if (typeof data[category][0] === 'string') {
            return data[category].filter(item => isEnabled(category, item));
        }
        // Handle arrays of objects
        return data[category].filter(item => isEnabled(category, item.name));
    }

    function generateRace() {
        const enabledRaces = getEnabledItems('races');
        if (enabledRaces.length === 0) {
            raceEl.textContent = 'No races selected';
            selectedRace = '';
            return;
        }
        selectedRace = getRandomElement(enabledRaces);
        raceEl.textContent = selectedRace;
    }

    function generateSkills() {
        skillsListEl.innerHTML = '';
        const enabledSkills = getEnabledItems('skills');
        if (enabledSkills.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No skills selected';
            skillsListEl.appendChild(li);
            return;
        }
        
        const numSkills = Math.min(5, enabledSkills.length);
        const selectedSkills = new Set();
        while (selectedSkills.size < numSkills) {
            selectedSkills.add(getRandomElement(enabledSkills));
        }

        selectedSkills.forEach(skill => {
            let skillText = skill;
            if (skill === 'One Handed') {
                const enabledTypes = getEnabledItems('oneHandedTypes');
                if (enabledTypes.length > 0) {
                    skillText += `: ${getRandomElement(enabledTypes)}`;
                }
            } else if (skill === 'Two Handed') {
                const enabledTypes = getEnabledItems('twoHandedTypes');
                if (enabledTypes.length > 0) {
                    skillText += `: ${getRandomElement(enabledTypes)}`;
                }
            } else if (skill === 'Archery') {
                const enabledTypes = getEnabledItems('archeryTypes');
                if (enabledTypes.length > 0) {
                    skillText += `: ${getRandomElement(enabledTypes)}`;
                }
            }
            const li = document.createElement('li');
            li.textContent = skillText;
            skillsListEl.appendChild(li);
        });
    }

    function generateAllegiances() {
        allegiancesListEl.innerHTML = '';
        const enabledAllegiances = getEnabledItems('allegiances');
        if (enabledAllegiances.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No allegiances selected';
            allegiancesListEl.appendChild(li);
            return;
        }
        
        const numAllegiances = Math.min(Math.floor(Math.random() * 5) + 1, enabledAllegiances.length);
        const selectedAllegiances = [];
        const enemyMap = new Map(enabledAllegiances.map(a => [a.name, a.enemy]));

        let attempts = 0;
        while (selectedAllegiances.length < numAllegiances && attempts < 100) {
            attempts++;
            const potentialAllegiance = getRandomElement(enabledAllegiances).name;
            const enemy = enemyMap.get(potentialAllegiance);

            if (!selectedAllegiances.includes(potentialAllegiance) && !selectedAllegiances.includes(enemy)) {
                selectedAllegiances.push(potentialAllegiance);
            }
        }

        selectedAllegiances.forEach(allegiance => {
            const li = document.createElement('li');
            li.textContent = allegiance;
            allegiancesListEl.appendChild(li);
        });
    }

    function generateStart() {
        if (!selectedRace) {
            startEl.textContent = 'No race selected';
            return;
        }
        
        // Filter by enabled starts first
        let enabledStarts = getEnabledItems('starts');
        if (enabledStarts.length === 0) {
            startEl.textContent = 'No alternate starts selected';
            return;
        }
        
        // Then filter by race compatibility
        let availableStarts = enabledStarts.filter(start => start.race === 'all' || start.race === selectedRace);
        if (!additionalStartsCheckbox.checked) {
            availableStarts = availableStarts.filter(start => !start.addOn);
        }
        
        if (availableStarts.length === 0) {
            startEl.textContent = 'No compatible starts available';
            return;
        }
        
        let selectedStart = getRandomElement(availableStarts);

        let startText = selectedStart.name;
        if (selectedStart.options) {
            startText += `: ${getRandomElement(selectedStart.options)}`;
        }
        startEl.textContent = startText;
    }

    function generateCharacter() {
        generateRace();
        generateSkills();
        generateAllegiances();
        generateStart();
    }

    generateBtn.addEventListener('click', generateCharacter);
    rerollRaceBtn.addEventListener('click', () => {
        generateRace();
        generateStart(); // Reroll start because it can be race-dependent
    });
    rerollSkillsBtn.addEventListener('click', generateSkills);
    rerollAllegiancesBtn.addEventListener('click', generateAllegiances);
    rerollStartBtn.addEventListener('click', generateStart);
    additionalStartsCheckbox.addEventListener('change', generateStart);
});
