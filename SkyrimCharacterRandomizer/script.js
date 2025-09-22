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

    let data = {};
    let selectedRace = '';

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            generateCharacter();
        });

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateRace() {
        selectedRace = getRandomElement(data.races);
        raceEl.textContent = selectedRace;
    }

    function generateSkills() {
        skillsListEl.innerHTML = '';
        const selectedSkills = new Set();
        while (selectedSkills.size < 5) {
            selectedSkills.add(getRandomElement(data.skills));
        }

        selectedSkills.forEach(skill => {
            let skillText = skill;
            if (skill === 'One Handed') {
                skillText += `: ${getRandomElement(data.oneHandedTypes)}`;
            } else if (skill === 'Two Handed') {
                skillText += `: ${getRandomElement(data.twoHandedTypes)}`;
            } else if (skill === 'Archery') {
                skillText += `: ${getRandomElement(data.archeryTypes)}`;
            }
            const li = document.createElement('li');
            li.textContent = skillText;
            skillsListEl.appendChild(li);
        });
    }

    function generateAllegiances() {
        allegiancesListEl.innerHTML = '';
        const numAllegiances = Math.floor(Math.random() * 5) + 1;
        const selectedAllegiances = [];
        const enemyMap = new Map(data.allegiances.map(a => [a.name, a.enemy]));

        while (selectedAllegiances.length < numAllegiances) {
            const potentialAllegiance = getRandomElement(data.allegiances).name;
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
        let availableStarts = data.starts.filter(start => start.race === 'all' || start.race === selectedRace);
        if (!additionalStartsCheckbox.checked) {
            availableStarts = availableStarts.filter(start => !start.addOn);
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
