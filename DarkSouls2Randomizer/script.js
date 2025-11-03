document.addEventListener('DOMContentLoaded', () => {
    const weaponEl = document.getElementById('weapon');
    const weaponLinkEl = document.getElementById('weapon-link');
    const armorEl = document.getElementById('armor');
    const armorLinkEl = document.getElementById('armor-link');
    const spellsListEl = document.getElementById('spells-list');
    const spellTypeLabelEl = document.getElementById('spell-type-label');
    const casterWeaponEl = document.getElementById('caster-weapon');
    const casterWeaponLinkEl = document.getElementById('caster-weapon-link');
    const casterWeaponSectionEl = document.getElementById('caster-weapon-section');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollWeaponBtn = document.getElementById('reroll-weapon');
    const rerollArmorBtn = document.getElementById('reroll-armor');
    const rerollSpellsBtn = document.getElementById('reroll-spells');
    const rerollCasterWeaponBtn = document.getElementById('reroll-caster-weapon');

    let weaponsData;
    let casterWeaponsData;
    let armorData;
    let magicData;

    let currentSpellType = '';
    const STORAGE_KEY = 'darkSouls2Options';
    let options = {};

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

    function generateWeapon() {
        if (!weaponsData || weaponsData.length === 0) return;
        const enabled = getEnabledItems('weapons', weaponsData);
        if (enabled.length === 0) return;
        const randomWeapon = getRandomElement(enabled);
        weaponEl.textContent = randomWeapon.name;
        weaponLinkEl.href = randomWeapon.url;
    }

    function generateArmor() {
        if (!armorData) return;
        const allArmor = [
            ...getEnabledItems('light_sets', armorData.light_sets),
            ...getEnabledItems('medium_sets', armorData.medium_sets),
            ...getEnabledItems('heavy_sets', armorData.heavy_sets)
        ];
        if (allArmor.length === 0) return;
        
        const randomArmorSet = getRandomElement(allArmor);
        armorEl.textContent = randomArmorSet.name;
        armorLinkEl.href = randomArmorSet.url;
    }

    function generateSpells() {
        if (!magicData) return;

        const spellRoll = Math.floor(Math.random() * 5) + 1;
        let selectedSpells = [];

        if (spellRoll === 2) { // Sorceries
            currentSpellType = '(Sorceries)';
            const enabledSorceries = getEnabledItems('sorceries', magicData.sorceries);
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledSorceries.length);
            const spellsCopy = [...enabledSorceries];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else if (spellRoll === 3) { // Miracles
            currentSpellType = '(Miracles)';
            const enabledMiracles = getEnabledItems('miracles', magicData.miracles);
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledMiracles.length);
            const spellsCopy = [...enabledMiracles];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else if (spellRoll === 4) { // Pyromancies
            currentSpellType = '(Pyromancies)';
            const enabledPyromancies = getEnabledItems('pyromancies', magicData.pyromancies);
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledPyromancies.length);
            const spellsCopy = [...enabledPyromancies];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else if (spellRoll === 5) { // Hexes
            currentSpellType = '(Hexes)';
            const enabledHexes = getEnabledItems('hexes', magicData.hexes);
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledHexes.length);
            const spellsCopy = [...enabledHexes];
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
        let casterWeaponLink = '#';

        if (currentSpellType === '(Sorceries)') {
            const staffs = casterWeaponsData.filter(w => 
                w.magic_type === 'Sorcery' || w.magic_type.includes('Sorcery')
            );
            if (staffs.length > 0) {
                const randomStaff = getRandomElement(staffs);
                casterWeaponName = randomStaff.name;
                casterWeaponLink = randomStaff.url;
            }
        } else if (currentSpellType === '(Miracles)') {
            const chimes = casterWeaponsData.filter(w => 
                w.magic_type === 'Miracle' || w.magic_type.includes('Miracle')
            );
            if (chimes.length > 0) {
                const randomChime = getRandomElement(chimes);
                casterWeaponName = randomChime.name;
                casterWeaponLink = randomChime.url;
            }
        } else if (currentSpellType === '(Pyromancies)') {
            const flames = casterWeaponsData.filter(w => w.magic_type === 'Pyromancy');
            if (flames.length > 0) {
                const randomFlame = getRandomElement(flames);
                casterWeaponName = randomFlame.name;
                casterWeaponLink = randomFlame.url;
            }
        } else if (currentSpellType === '(Hexes)') {
            // Hexes can use staffs or chimes that support hexes
            const hexWeapons = casterWeaponsData.filter(w => 
                w.magic_type.includes('Hex') || w.magic_type === 'Sorcery/Miracle/Hex'
            );
            if (hexWeapons.length > 0) {
                const randomHexWeapon = getRandomElement(hexWeapons);
                casterWeaponName = randomHexWeapon.name;
                casterWeaponLink = randomHexWeapon.url;
            }
        }

        casterWeaponEl.textContent = casterWeaponName;
        casterWeaponLinkEl.href = casterWeaponLink;
    }

    function generateAll() {
        generateWeapon();
        generateArmor();
        generateSpells();
    }

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            weaponsData = data.weapons;
            casterWeaponsData = data.caster_weapons;
            armorData = data.armor;
            magicData = data.magic;

            loadOptions();
            generateAll();

            generateLoadoutBtn.addEventListener('click', generateAll);
            rerollWeaponBtn.addEventListener('click', generateWeapon);
            rerollArmorBtn.addEventListener('click', generateArmor);
            rerollSpellsBtn.addEventListener('click', generateSpells);
            rerollCasterWeaponBtn.addEventListener('click', generateCasterWeapon);
        })
        .catch(error => console.error('Error loading data:', error));
});
