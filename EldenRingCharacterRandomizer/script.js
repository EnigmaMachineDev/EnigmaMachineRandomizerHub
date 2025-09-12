document.addEventListener('DOMContentLoaded', () => {
    const weaponEl = document.getElementById('weapon');
    const weaponLinkEl = document.getElementById('weapon-link');
    const armorEl = document.getElementById('armor');
    const armorLinkEl = document.getElementById('armor-link');
    const talismanListEl = document.getElementById('talisman-list');
    const spiritAshesListEl = document.getElementById('spirit-ashes-list');
    const spellsListEl = document.getElementById('spells-list');
    const spellTypeLabelEl = document.getElementById('spell-type-label');
    const casterWeaponEl = document.getElementById('caster-weapon');
    const casterWeaponLinkEl = document.getElementById('caster-weapon-link');
    const casterWeaponSectionEl = document.getElementById('caster-weapon-section');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollWeaponBtn = document.getElementById('reroll-weapon');
    const rerollArmorBtn = document.getElementById('reroll-armor');
    const rerollTalismansBtn = document.getElementById('reroll-talismans');
    const rerollSpiritAshesBtn = document.getElementById('reroll-spirit-ashes');
    const rerollSpellsBtn = document.getElementById('reroll-spells');
    const rerollCasterWeaponBtn = document.getElementById('reroll-caster-weapon');

    let primaryWeaponData;
    let armorData;
    let allTalismansData;
    let spiritAshesData;
    let eldenRingSpellsData;
    let eldenRingCastingWeaponsData;

    let selectedTalismans = [];
    let currentSpellType = '';

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    function generateWeapon() {
        if (!primaryWeaponData) return;
        const weaponNames = Object.keys(primaryWeaponData);
        const randomWeaponName = getRandomElement(weaponNames);
        const randomWeaponLink = primaryWeaponData[randomWeaponName];
        weaponEl.textContent = randomWeaponName;
        weaponLinkEl.href = randomWeaponLink;
    }

    function generateArmor() {
        if (!armorData) return;
        const armorTypes = ['light', 'medium', 'heavy'];
        const randomArmorType = getRandomElement(armorTypes);
        const selectedArmorSets = armorData[randomArmorType];
        const randomArmorSet = getRandomElement(selectedArmorSets);
        armorEl.textContent = randomArmorSet.name;
        armorLinkEl.href = randomArmorSet.link;
    }

    function generateTalismans() {
        if (!allTalismansData) return;
        const numberOfTalismans = 4;
        selectedTalismans = [];
        const talismansCopy = [...allTalismansData];

        for (let i = 0; i < numberOfTalismans; i++) {
            if (talismansCopy.length === 0) break;
            const randomIndex = Math.floor(Math.random() * talismansCopy.length);
            selectedTalismans.push(talismansCopy.splice(randomIndex, 1)[0]);
        }

        talismanListEl.innerHTML = '';
        selectedTalismans.forEach(talisman => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${talisman.link}" target="_blank">${talisman.name}</a>`;
            talismanListEl.appendChild(li);
        });
    }

    function generateSpiritAshes() {
        if (!spiritAshesData) return;
        const numberOfSpiritAshes = Math.floor(Math.random() * 5) + 1;
        const selectedSpiritAshes = [];
        const spiritAshesCopy = [...spiritAshesData];

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
        if (!eldenRingSpellsData) return;

        const spellRoll = Math.floor(Math.random() * 3) + 1;
        let selectedSpells = [];

        if (spellRoll === 2) { // Sorceries
            currentSpellType = '(Sorceries)';
            const sorceries = eldenRingSpellsData.filter(spell => spell.type === 'Sorcery');
            const numberOfSpells = Math.floor(Math.random() * 3) + 1;
            const spellsCopy = [...sorceries];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else if (spellRoll === 3) { // Incantations
            currentSpellType = '(Incantations)';
            const incantations = eldenRingSpellsData.filter(spell => spell.type === 'Incantation');
            const numberOfSpells = Math.floor(Math.random() * 3) + 1;
            const spellsCopy = [...incantations];
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
                li.innerHTML = `<a href="${spell.link}" target="_blank">${spell.name}</a>`;
                spellsListEl.appendChild(li);
            });
        }

        spellTypeLabelEl.textContent = `Spells: ${currentSpellType}`;
        generateCasterWeapon();
    }

    function generateCasterWeapon() {
        if (!eldenRingCastingWeaponsData || currentSpellType === '(None)') {
            casterWeaponSectionEl.style.display = 'none';
            return;
        }
        casterWeaponSectionEl.style.display = 'block';

        let casterWeaponName = 'None';
        let casterWeaponLink = '#';

        if (currentSpellType === '(Sorceries)') {
            const staffs = eldenRingCastingWeaponsData.staffs;
            if (staffs.length > 0) {
                const randomStaff = getRandomElement(staffs);
                casterWeaponName = randomStaff.name;
                casterWeaponLink = randomStaff.url;
            }
        } else if (currentSpellType === '(Incantations)') {
            const seals = eldenRingCastingWeaponsData.seals;
            if (seals.length > 0) {
                const randomSeal = getRandomElement(seals);
                casterWeaponName = randomSeal.name;
                casterWeaponLink = randomSeal.url;
            }
        }

        casterWeaponEl.textContent = casterWeaponName;
        casterWeaponLinkEl.href = casterWeaponLink;
    }

    function generateAll() {
        generateWeapon();
        generateArmor();
        generateTalismans();
        generateSpiritAshes();
        generateSpells();
    }

    Promise.all([
        fetch('elden_ring_weapons.json').then(res => res.json()),
        fetch('elden_ring_armor.json').then(res => res.json()),
        fetch('elden_ring_talismans.json').then(res => res.json()),
        fetch('elden_ring_spirit_ashes.json').then(res => res.json()),
        fetch('elden_ring_spells.json').then(res => res.json()),
        fetch('elden_ring_casting_weapons.json').then(res => res.json())
    ]).then(([weapons, armor, talismans, spiritAshes, spells, castingWeapons]) => {
        primaryWeaponData = weapons;
        armorData = armor;
        allTalismansData = talismans;
        spiritAshesData = spiritAshes;
        eldenRingSpellsData = spells;
        eldenRingCastingWeaponsData = castingWeapons;

        generateAll();

        generateLoadoutBtn.addEventListener('click', generateAll);
        rerollWeaponBtn.addEventListener('click', generateWeapon);
        rerollArmorBtn.addEventListener('click', generateArmor);
        rerollTalismansBtn.addEventListener('click', generateTalismans);
        rerollSpiritAshesBtn.addEventListener('click', generateSpiritAshes);
        rerollSpellsBtn.addEventListener('click', generateSpells);
        rerollCasterWeaponBtn.addEventListener('click', generateCasterWeapon);
    }).catch(error => console.error('Error loading data:', error));
});