document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    let data;
    let currentAscendancy;

    const ascendancySkills = {
        "Pathfinder": ["Bleeding Concoction", "Acidic Concoction", "Shattering Concoction", "Fulminating Concoction", "Explosive Concoction"],
        "Smith of Kitava": ["Manifest Weapon"],
        "Warbringer": ["Seismic Cry", "Infernal Cry", "Fortifying Cry", "Ancestral Cry"],
        "Invoker": ["Elemental Expression"]
    };

    fetch('randomizer.json')
        .then(response => {
            console.log('Fetch response received:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(jsonData => {
            console.log('JSON data parsed successfully:', jsonData);
            data = jsonData;
            enableButtons();
            setupEventListeners();
        })
        .catch(error => {
            console.error('Error fetching or parsing randomizer.json:', error);
        });

    function enableButtons() {
        console.log('Enabling buttons');
        document.getElementById('roll-all-btn').disabled = false;
        document.getElementById('roll-class-btn').disabled = false;
        document.getElementById('roll-weapon-skills-btn').disabled = false;
        document.getElementById('roll-defense-btn').disabled = false;
    }

    function setupEventListeners() {
        console.log('Setting up event listeners');
        document.getElementById('roll-all-btn').addEventListener('click', rollAll);
        document.getElementById('roll-class-btn').addEventListener('click', rollClassAndAscendancy);
        document.getElementById('roll-weapon-skills-btn').addEventListener('click', rollWeaponAndSkills);
        document.getElementById('roll-defense-btn').addEventListener('click', rollDefense);
    }

    function getRandomItem(arr) {
        if (!arr || arr.length === 0) {
            console.error('Cannot get random item from empty or invalid array:', arr);
            return null;
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function rollClassAndAscendancy() {
        console.log('Rolling class and ascendancy');
        const randomClass = getRandomItem(data.classes);
        if (!randomClass) return;
        const randomAscendancy = getRandomItem(randomClass.ascendancies);
        if (!randomAscendancy) return;
        currentAscendancy = randomAscendancy;
        document.getElementById('class-result').textContent = `Class: ${randomClass.name}`;
        document.getElementById('ascendancy-result').textContent = `Ascendancy: ${randomAscendancy}`;
    }

    function rollWeaponAndSkills() {
        console.log('Rolling weapon and skills');
        const randomWeapon = getRandomItem(data.weapons);
        if (!randomWeapon) return;

        let skillPool = [...randomWeapon.skills];
        if (currentAscendancy && ascendancySkills[currentAscendancy]) {
            skillPool.push(...ascendancySkills[currentAscendancy]);
        }

        const numSkills = Math.floor(Math.random() * 3) + 1;
        const selectedSkills = [];
        if (skillPool.length > 0) {
            for (let i = 0; i < numSkills; i++) {
                selectedSkills.push(getRandomItem(skillPool));
            }
        }

        document.getElementById('weapon-type-result').textContent = `Weapon Type: ${randomWeapon.name}`;
        document.getElementById('main-skills-result').textContent = `Main Skill(s): ${selectedSkills.join(', ')}`;
    }

    function rollDefense() {
        console.log('Rolling defense');
        const randomDefense = getRandomItem(data.defense);
        if (!randomDefense) return;
        document.getElementById('defense-strategy-result').textContent = `${randomDefense.name}`;
    }

    function rollAll() {
        console.log('Rolling all');
        rollClassAndAscendancy();
        rollWeaponAndSkills();
        rollDefense();
    }
});