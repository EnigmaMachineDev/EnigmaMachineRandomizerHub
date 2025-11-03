document.addEventListener('DOMContentLoaded', () => {
    const armorEl = document.getElementById('armor');
    const weaponEl = document.getElementById('weapon');
    const casterWeaponEl = document.getElementById('caster-weapon');
    const spellsListEl = document.getElementById('spells-list');
    const spellTypeLabelEl = document.getElementById('spell-type-label');
    const casterWeaponSectionEl = document.getElementById('caster-weapon-section');
    const endingEl = document.getElementById('ending');
    const endingLink = document.getElementById('ending-link');

    const armorLink = document.getElementById('armor-link');
    const weaponLink = document.getElementById('weapon-link');
    const casterWeaponLink = document.getElementById('caster-weapon-link');

    const rerollArmorBtn = document.getElementById('reroll-armor');
    const rerollWeaponBtn = document.getElementById('reroll-weapon');
    const rerollCasterWeaponBtn = document.getElementById('reroll-caster-weapon');
    const rerollSpellsBtn = document.getElementById('reroll-spells');
    const rerollEndingBtn = document.getElementById('reroll-ending');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let armorData;
    let weaponsData;
    let spellsData;
    let casterWeaponsData;
    let endingsData;
    let currentSpellType = '';

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const STORAGE_KEY = 'darkSouls3Options';
    let options = {};
    let data = {};

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
        return data[category].filter(item => isEnabled(category, item.name));
    }

    function generateArmor() {
        if (!armorData) return;
        const randomArmor = getRandomElement(armorData);
        armorEl.textContent = randomArmor.name;
        armorLink.href = randomArmor.link;
    }

    function generateWeapon() {
        if (!weaponsData) return;
        const randomWeapon = getRandomElement(weaponsData);
        weaponEl.textContent = randomWeapon.name;
        weaponLink.href = randomWeapon.url || randomWeapon.link;
    }

    function generateSpells() {
        if (!spellsData) return;

        const spellRoll = Math.floor(Math.random() * 4);
        let selectedSpells = [];
        let spellType = '';

        if (spellRoll === 1) { // Sorceries
            spellType = 'Sorcery';
            const sorceries = spellsData.filter(spell => spell.type === 'Sorcery');
            const numberOfSpells = Math.floor(Math.random() * 3) + 1;
            const spellsCopy = [...sorceries];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else if (spellRoll === 2) { // Pyromancies
            spellType = 'Pyromancy';
            const pyromancies = spellsData.filter(spell => spell.type === 'Pyromancy');
            const numberOfSpells = Math.floor(Math.random() * 3) + 1;
            const spellsCopy = [...pyromancies];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else if (spellRoll === 3) { // Miracles
            spellType = 'Miracle';
            const miracles = spellsData.filter(spell => spell.type === 'Miracle');
            const numberOfSpells = Math.floor(Math.random() * 3) + 1;
            const spellsCopy = [...miracles];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else { // None
            spellType = 'None';
        }

        currentSpellType = spellType;
        spellsListEl.innerHTML = '';
        if (selectedSpells.length > 0) {
            selectedSpells.forEach(spell => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${spell.link}" target="_blank">${spell.name}</a>`;
                spellsListEl.appendChild(li);
            });
        }

        spellTypeLabelEl.textContent = `Spells: (${currentSpellType})`;
        generateCasterWeapon();
    }

    function generateCasterWeapon() {
        if (!casterWeaponsData || currentSpellType === 'None') {
            casterWeaponSectionEl.style.display = 'none';
            return;
        }
        casterWeaponSectionEl.style.display = 'block';

        let casterWeaponName = 'None';
        let applicableWeapons = [];

        if (currentSpellType === 'Sorcery') {
            applicableWeapons = casterWeaponsData.filter(weapon => weapon.type === 'Staff');
        } else if (currentSpellType === 'Pyromancy') {
            applicableWeapons = casterWeaponsData.filter(weapon => weapon.type === 'Flame');
        } else if (currentSpellType === 'Miracle') {
            applicableWeapons = casterWeaponsData.filter(weapon => weapon.type === 'Chime' || weapon.type === 'Talisman');
        }

        if (applicableWeapons.length > 0) {
            const randomWeapon = getRandomElement(applicableWeapons);
            casterWeaponName = randomWeapon.name;
            casterWeaponLink.href = randomWeapon.link;
        }

        casterWeaponEl.textContent = casterWeaponName;
    }

    function generateEnding() {
        if (!endingsData) return;
        const randomEnding = getRandomElement(endingsData);
        endingEl.textContent = randomEnding.name;
        endingLink.href = randomEnding.link;
    }

    function randomizeAll() {
        generateArmor();
        generateWeapon();
        generateSpells();
        generateEnding();
    }

    loadOptions();

    fetch('randomizer.json')
        .then(res => res.json())
        .then(dataRes => {
            data = dataRes;
            armorData = data.armor;
            weaponsData = data.weapons;
            spellsData = data.spells;
            casterWeaponsData = data.casterweapons;
            endingsData = data.endings;

            loadOptions();randomizeAll();

            rerollArmorBtn.addEventListener('click', generateArmor);
            rerollWeaponBtn.addEventListener('click', generateWeapon);
            rerollSpellsBtn.addEventListener('click', generateSpells);
            rerollCasterWeaponBtn.addEventListener('click', generateCasterWeapon);
            rerollEndingBtn.addEventListener('click', generateEnding);
            generateLoadoutBtn.addEventListener('click', randomizeAll);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Failed to load necessary data. Please check the console for more details and ensure the .json file is present and correctly formatted.');
        });
});