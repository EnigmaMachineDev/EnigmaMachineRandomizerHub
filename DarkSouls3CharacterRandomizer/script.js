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
    let magicData;
    let casterWeaponsData;
    let endingsData;
    let currentSpellType = '';

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const STORAGE_KEY = 'darkSouls3Options';
    let options = {};

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

    function getEnabledItems(category, items) {
        if (!items) return [];
        return items.filter(item => isEnabled(category, item.name));
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
        if (!magicData || !casterWeaponsData) return;

        // Determine which caster weapon types are available
        const enabledCasterWeapons = getEnabledItems('caster_weapons', casterWeaponsData);
        const availableMagicTypes = new Set();
        enabledCasterWeapons.forEach(weapon => {
            availableMagicTypes.add(weapon.magic_type);
        });

        // Determine which spell types have enabled spells AND matching caster weapons
        const availableSpellTypes = [];
        const enabledSorceries = getEnabledItems('sorceries', magicData.sorceries);
        const enabledMiracles = getEnabledItems('miracles', magicData.miracles);
        const enabledPyromancies = getEnabledItems('pyromancies', magicData.pyromancies);

        if (enabledSorceries.length > 0 && availableMagicTypes.has('Sorcery')) {
            availableSpellTypes.push('Sorceries');
        }
        if (enabledMiracles.length > 0 && availableMagicTypes.has('Miracle')) {
            availableSpellTypes.push('Miracles');
        }
        if (enabledPyromancies.length > 0 && availableMagicTypes.has('Pyromancy')) {
            availableSpellTypes.push('Pyromancies');
        }

        // Always include "None" as an option
        availableSpellTypes.push('None');

        const spellRoll = getRandomElement(availableSpellTypes);
        let selectedSpells = [];

        if (spellRoll === 'Sorceries') {
            currentSpellType = '(Sorceries)';
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledSorceries.length);
            const spellsCopy = [...enabledSorceries];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else if (spellRoll === 'Miracles') {
            currentSpellType = '(Miracles)';
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledMiracles.length);
            const spellsCopy = [...enabledMiracles];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else if (spellRoll === 'Pyromancies') {
            currentSpellType = '(Pyromancies)';
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledPyromancies.length);
            const spellsCopy = [...enabledPyromancies];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else { // None
            currentSpellType = '(None)';
        }

        spellsListEl.innerHTML = '';
        if (selectedSpells.length > 0) {
            selectedSpells.forEach(spell => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${spell.url}" target="_blank">${spell.name}</a>`;
                spellsListEl.appendChild(li);
            });
        }

        spellTypeLabelEl.textContent = `Spells: ${currentSpellType}`;
        generateCasterWeapon();
    }

    function generateCasterWeapon() {
        if (!casterWeaponsData || currentSpellType === '(None)') {
            casterWeaponSectionEl.style.display = 'none';
            return;
        }
        casterWeaponSectionEl.style.display = 'block';

        let casterWeaponName = 'None';
        let casterWeaponUrl = '#';

        if (currentSpellType === '(Sorceries)') {
            const catalysts = getEnabledItems('caster_weapons', casterWeaponsData).filter(w => w.magic_type === 'Sorcery');
            if (catalysts.length > 0) {
                const randomCatalyst = getRandomElement(catalysts);
                casterWeaponName = randomCatalyst.name;
                casterWeaponUrl = randomCatalyst.url;
            }
        } else if (currentSpellType === '(Miracles)') {
            const talismans = getEnabledItems('caster_weapons', casterWeaponsData).filter(w => w.magic_type === 'Miracle');
            if (talismans.length > 0) {
                const randomTalisman = getRandomElement(talismans);
                casterWeaponName = randomTalisman.name;
                casterWeaponUrl = randomTalisman.url;
            }
        } else if (currentSpellType === '(Pyromancies)') {
            const flames = getEnabledItems('caster_weapons', casterWeaponsData).filter(w => w.magic_type === 'Pyromancy');
            if (flames.length > 0) {
                const randomFlame = getRandomElement(flames);
                casterWeaponName = randomFlame.name;
                casterWeaponUrl = randomFlame.url;
            }
        }

        casterWeaponEl.textContent = casterWeaponName;
        casterWeaponLink.href = casterWeaponUrl;
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
        .then(data => {
            armorData = data.armor;
            weaponsData = data.weapons;
            magicData = data.magic;
            casterWeaponsData = data.caster_weapons;
            endingsData = data.endings;

            loadOptions();
            randomizeAll();

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