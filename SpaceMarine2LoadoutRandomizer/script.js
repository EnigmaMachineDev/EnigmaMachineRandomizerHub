document.addEventListener('DOMContentLoaded', () => {
    const chapterEl = document.getElementById('chapter');
    const classEl = document.getElementById('class');
    const primaryEl = document.getElementById('primary');
    const secondaryEl = document.getElementById('secondary');
    const meleeEl = document.getElementById('melee');
    const missionEl = document.getElementById('mission');

    const rerollChapterBtn = document.getElementById('reroll-chapter');
    const rerollClassBtn = document.getElementById('reroll-class');
    const rerollPrimaryBtn = document.getElementById('reroll-primary');
    const rerollSecondaryBtn = document.getElementById('reroll-secondary');
    const rerollMeleeBtn = document.getElementById('reroll-melee');
    const rerollMissionBtn = document.getElementById('reroll-mission');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data={};const STORAGE_KEY='spaceMarine2Options';let options={};
    let currentClass = '';

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
        });

    function getRandomItem(items) {
        if (!items || items.length === 0) return 'N/A';
        return items[Math.floor(Math.random() * items.length)];
    }

    function getRandomValue(arr){return arr[Math.floor(Math.random()*arr.length)];}
    function loadOptions(){const saved=localStorage.getItem(STORAGE_KEY);if(saved){try{options=JSON.parse(saved);}catch(e){}}}
    function isEnabled(category,name){if(!options[category])return true;if(!options[category].hasOwnProperty(name))return true;return options[category][name];}
    function getEnabledItems(category){if(!data[category])return[];return data[category].filter(item=>isEnabled(category,item.name||item));}
    function getEnabledWeapons(weaponCategory){if(!data[weaponCategory])return[];return data[weaponCategory].filter(weapon=>isEnabled(weaponCategory,weapon));}

    function setItem(element, item) {
        element.textContent = item;
    }

    function rollChapter() {
        const enabledChapters = getEnabledItems('chapters');
        if (enabledChapters.length === 0) {
            setItem(chapterEl, 'No chapters selected');
            return;
        }
        const chapter = getRandomItem(enabledChapters);
        setItem(chapterEl, chapter.name);
    }

    function rollClass() {
        const enabledClasses = getEnabledItems('classList');
        if (enabledClasses.length === 0) {
            currentClass = '';
            setItem(classEl, 'No classes selected');
            setItem(primaryEl, 'N/A');
            setItem(secondaryEl, 'N/A');
            setItem(meleeEl, 'N/A');
            return;
        }
        currentClass = getRandomItem(enabledClasses);
        setItem(classEl, currentClass);
        rollWeapons();
    }

    function rollWeapons() {
        if (!currentClass || !data.classes[currentClass]) {
            setItem(primaryEl, 'N/A');
            setItem(secondaryEl, 'N/A');
            setItem(meleeEl, 'N/A');
            return;
        }
        
        const classData = data.classes[currentClass];
        
        // Filter weapons by both class compatibility AND user options
        const enabledPrimaries = getEnabledWeapons('allPrimaries');
        const enabledSecondaries = getEnabledWeapons('allSecondaries');
        const enabledMelee = getEnabledWeapons('allMelee');
        
        const availablePrimaries = classData.primaries.filter(w => enabledPrimaries.includes(w));
        const availableSecondaries = classData.secondaries.filter(w => enabledSecondaries.includes(w));
        const availableMelee = classData.melee.filter(w => enabledMelee.includes(w));
        
        const primary = getRandomItem(availablePrimaries) || 'N/A';
        const secondary = getRandomItem(availableSecondaries) || 'N/A';
        const melee = getRandomItem(availableMelee) || 'N/A';

        setItem(primaryEl, primary);
        setItem(secondaryEl, secondary);
        setItem(meleeEl, melee);
    }

    function rollMission() {
        const mission = getRandomItem(data.missions);
        setItem(missionEl, mission);
    }

    function randomizeAll() {
        rollChapter();
        rollClass();
        rollMission();
    }

    rerollChapterBtn.addEventListener('click', rollChapter);
    rerollClassBtn.addEventListener('click', rollClass);
    rerollPrimaryBtn.addEventListener('click', () => {
        if (!currentClass || !data.classes[currentClass]) return;
        const enabledPrimaries = getEnabledWeapons('allPrimaries');
        const availablePrimaries = data.classes[currentClass].primaries.filter(w => enabledPrimaries.includes(w));
        const primary = getRandomItem(availablePrimaries) || 'N/A';
        setItem(primaryEl, primary);
    });
    rerollSecondaryBtn.addEventListener('click', () => {
        if (!currentClass || !data.classes[currentClass]) return;
        const enabledSecondaries = getEnabledWeapons('allSecondaries');
        const availableSecondaries = data.classes[currentClass].secondaries.filter(w => enabledSecondaries.includes(w));
        const secondary = getRandomItem(availableSecondaries) || 'N/A';
        setItem(secondaryEl, secondary);
    });
    rerollMeleeBtn.addEventListener('click', () => {
        if (!currentClass || !data.classes[currentClass]) return;
        const enabledMelee = getEnabledWeapons('allMelee');
        const availableMelee = data.classes[currentClass].melee.filter(w => enabledMelee.includes(w));
        const melee = getRandomItem(availableMelee) || 'N/A';
        setItem(meleeEl, melee);
    });
    rerollMissionBtn.addEventListener('click', rollMission);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});