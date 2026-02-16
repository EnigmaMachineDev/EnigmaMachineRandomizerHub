document.addEventListener('DOMContentLoaded', () => {
    let data = {};
    const STORAGE_KEY = 'pathOfExile2Options';
    let options = {};
    let currentAscendancy;

    const classResultEl = document.getElementById('class-result');
    const weaponSkillsResultEl = document.getElementById('weapon-skills-result');
    const defenseResultEl = document.getElementById('defense-result');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollClassBtn = document.getElementById('reroll-class');
    const rerollWeaponSkillsBtn = document.getElementById('reroll-weapon-skills');
    const rerollDefenseBtn = document.getElementById('reroll-defense');

    const ascendancySkills = {
        "Pathfinder": ["Bleeding Concoction", "Acidic Concoction", "Shattering Concoction", "Fulminating Concoction", "Explosive Concoction"],
        "Smith of Kitava": ["Manifest Weapon"],
        "Warbringer": ["Seismic Cry", "Infernal Cry", "Fortifying Cry", "Ancestral Cry", "Ancestral Spirits"],
        "Invoker": ["Elemental Expression"],
        "Infernalist": ["Summon Infernal Hound"],
        "Amazon": ["Elemental Surge"],
        "Shaman": ["Apocalypse"],
        "Oracle": ["Align Fate"]
    };

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
            setupEventListeners();
        })
        .catch(error => console.error('Error fetching or parsing randomizer.json:', error));

    function setupEventListeners() {
        generateLoadoutBtn.addEventListener('click', rollAll);
        rerollClassBtn.addEventListener('click', rollClassAndAscendancy);
        rerollWeaponSkillsBtn.addEventListener('click', rollWeaponAndSkills);
        rerollDefenseBtn.addEventListener('click', rollDefense);
    }

    function getRandomItem(arr) {
        if (!arr || arr.length === 0) {
            return null;
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) { }
        }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function getEnabledItems(category) {
        if (!data[category]) return [];
        return data[category].filter(item => isEnabled(category, item.name));
    }

    function rollClassAndAscendancy() {
        const randomClass = getRandomItem(getEnabledItems('classes'));
        if (!randomClass) return;
        const randomAscendancy = getRandomItem(randomClass.ascendancies);
        if (!randomAscendancy) return;
        currentAscendancy = randomAscendancy;
        classResultEl.innerHTML = `<strong>Class:</strong> ${randomClass.name}<br><strong>Ascendancy:</strong> ${randomAscendancy}`;
    }

    function rollWeaponAndSkills() {
        const enabledWeapons = getEnabledItems('weapons');
        if (enabledWeapons.length === 0) {
            weaponSkillsResultEl.innerHTML = `<strong>Weapon Type:</strong> No weapons selected<br><strong>Main Skill(s):</strong> None`;
            return;
        }
        
        const randomWeapon = getRandomItem(enabledWeapons);
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

        weaponSkillsResultEl.innerHTML = `<strong>Weapon Type:</strong> ${randomWeapon.name}<br><strong>Main Skill(s):</strong> ${selectedSkills.join(', ')}`;
    }

    function rollDefense() {
        const enabledDefense = getEnabledItems('defense');
        if (enabledDefense.length === 0) {
            defenseResultEl.textContent = 'No defense types selected';
            return;
        }
        const randomDefense = getRandomItem(enabledDefense);
        if (!randomDefense) return;
        defenseResultEl.textContent = `${randomDefense.name}`;
    }

    function rollAll() {
        rollClassAndAscendancy();
        rollWeaponAndSkills();
        rollDefense();
    }

    function randomizeAll() {
        rollAll();
    }

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
