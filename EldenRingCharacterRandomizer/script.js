document.addEventListener('DOMContentLoaded', () => {
    const weaponEl = document.getElementById('weapon');
    const weaponLinkEl = document.getElementById('weapon-link');
    const armorEl = document.getElementById('armor');
    const armorLinkEl = document.getElementById('armor-link');
    const spiritAshesListEl = document.getElementById('spirit-ashes-list');
    const spellsListEl = document.getElementById('spells-list');
    const spellTypeLabelEl = document.getElementById('spell-type-label');
    const casterWeaponEl = document.getElementById('caster-weapon');
    const casterWeaponLinkEl = document.getElementById('caster-weapon-link');
    const casterWeaponSectionEl = document.getElementById('caster-weapon-section');
    const endingEl = document.getElementById('ending');
    const endingLinkEl = document.getElementById('ending-link');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollWeaponBtn = document.getElementById('reroll-weapon');
    const rerollArmorBtn = document.getElementById('reroll-armor');
    const rerollSpiritAshesBtn = document.getElementById('reroll-spirit-ashes');
    const rerollSpellsBtn = document.getElementById('reroll-spells');
    const rerollCasterWeaponBtn = document.getElementById('reroll-caster-weapon');
    const rerollEndingBtn = document.getElementById('reroll-ending');

    let primaryWeaponData;
    let armorData;
    let spiritAshesData;
    let magicData;
    let casterWeaponsData;
    let endingsData;
    let currentSpellType = '';

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const STORAGE_KEY = 'eldenRingOptions';
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

    function generateWeapon() {
        if (!primaryWeaponData) return;
        const enabledWeapons = getEnabledItems('weapons', primaryWeaponData);
        if (enabledWeapons.length === 0) return;
        const randomWeaponName = getRandomElement(enabledWeapons);
        const randomWeaponLink = primaryWeaponData[randomWeaponName];
        weaponEl.textContent = randomWeaponName;
        weaponLinkEl.href = randomWeaponLink;
    }

    function generateArmor() {
        if (!armorData) return;
        // Combine all armor types into one pool, checking each subcategory
        const lightArmor = armorData.light_sets ? armorData.light_sets.filter(armor => isEnabled('light_sets', armor.name)) : [];
        const mediumArmor = armorData.medium_sets ? armorData.medium_sets.filter(armor => isEnabled('medium_sets', armor.name)) : [];
        const heavyArmor = armorData.heavy_sets ? armorData.heavy_sets.filter(armor => isEnabled('heavy_sets', armor.name)) : [];
        
        const enabledArmor = [...lightArmor, ...mediumArmor, ...heavyArmor];
        if (enabledArmor.length === 0) {
            armorEl.textContent = 'No armor available';
            armorLinkEl.href = '#';
            return;
        }
        
        const randomArmorSet = getRandomElement(enabledArmor);
        armorEl.textContent = randomArmorSet.name;
        armorLinkEl.href = randomArmorSet.link;
    }

    function generateSpiritAshes() {
        if (!spiritAshesData) return;
        const enabledSpirits = getEnabledItems('spirit_ashes', spiritAshesData);
        if (enabledSpirits.length === 0) return;
        
        const numberOfSpiritAshes = Math.min(Math.floor(Math.random() * 5) + 1, enabledSpirits.length);
        const selectedSpiritAshes = [];
        const spiritAshesCopy = [...enabledSpirits];

        for (let i = 0; i < numberOfSpiritAshes; i++) {
            if (spiritAshesCopy.length === 0) break;
            const randomIndex = Math.floor(Math.random() * spiritAshesCopy.length);
            selectedSpiritAshes.push(spiritAshesCopy.splice(randomIndex, 1)[0]);
        }

        spiritAshesListEl.innerHTML = '';
        selectedSpiritAshes.forEach(ash => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${ash.link}" target="_blank">${ash.name}</a>`;
            spiritAshesListEl.appendChild(li);
        });
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
        const enabledIncantations = getEnabledItems('incantations', magicData.incantations);

        if (enabledSorceries.length > 0 && availableMagicTypes.has('Sorcery')) {
            availableSpellTypes.push('Sorceries');
        }
        if (enabledIncantations.length > 0 && availableMagicTypes.has('Incantation')) {
            availableSpellTypes.push('Incantations');
        }

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
        } else if (spellRoll === 'Incantations') {
            currentSpellType = '(Incantations)';
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledIncantations.length);
            const spellsCopy = [...enabledIncantations];
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
            const staffs = getEnabledItems('caster_weapons', casterWeaponsData).filter(w => w.magic_type === 'Sorcery');
            if (staffs.length > 0) {
                const randomStaff = getRandomElement(staffs);
                casterWeaponName = randomStaff.name;
                casterWeaponUrl = randomStaff.url;
            }
        } else if (currentSpellType === '(Incantations)') {
            const seals = getEnabledItems('caster_weapons', casterWeaponsData).filter(w => w.magic_type === 'Incantation');
            if (seals.length > 0) {
                const randomSeal = getRandomElement(seals);
                casterWeaponName = randomSeal.name;
                casterWeaponUrl = randomSeal.url;
            }
        }

        casterWeaponEl.textContent = casterWeaponName;
        casterWeaponLinkEl.href = casterWeaponUrl;
    }

    function generateEnding() {
        if (!endingsData) return;
        const enabledEndings = getEnabledItems('endings', endingsData);
        if (enabledEndings.length === 0) return;
        const randomEnding = getRandomElement(enabledEndings);
        endingEl.textContent = randomEnding.name;
        endingLinkEl.href = randomEnding.link;
    }

    function generateAll() {
        generateWeapon();
        generateArmor();
        generateSpiritAshes();
        generateSpells();
        generateEnding();
    }

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            primaryWeaponData = data.weapons;
            armorData = data.armor;
            spiritAshesData = data.spirit_ashes;
            magicData = data.magic;
            casterWeaponsData = data.caster_weapons;
            endingsData = data.endings;

            loadOptions();
            generateAll();

            generateLoadoutBtn.addEventListener('click', generateAll);
            rerollWeaponBtn.addEventListener('click', generateWeapon);
            rerollArmorBtn.addEventListener('click', generateArmor);
            rerollSpiritAshesBtn.addEventListener('click', generateSpiritAshes);
            rerollSpellsBtn.addEventListener('click', generateSpells);
            rerollCasterWeaponBtn.addEventListener('click', generateCasterWeapon);
            rerollEndingBtn.addEventListener('click', generateEnding);
        })
        .catch(error => console.error('Error loading data:', error));
});
