document.addEventListener('DOMContentLoaded', () => {
    const chapterEl = document.getElementById('chapter');
    const classEl = document.getElementById('class');
    const primaryEl = document.getElementById('primary');
    const secondaryEl = document.getElementById('secondary');
    const meleeEl = document.getElementById('melee');
    const missionEl = document.getElementById('mission');
    const enableDlcEl = document.getElementById('enable-dlc');

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
            loadOptions();randomizeAll();
        });

    function getRandomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function getRandomValue(arr){return arr[Math.floor(Math.random()*arr.length)];}
    function loadOptions(){const saved=localStorage.getItem(STORAGE_KEY);if(saved){try{options=JSON.parse(saved);}catch(e){}}}
    function isEnabled(category,name){if(!options[category])return true;if(!options[category].hasOwnProperty(name))return true;return options[category][name];}
    function getEnabledItems(category){if(!data[category])return[];return data[category].filter(item=>isEnabled(category,item.name));}

    function setItem(element, item) {
        element.textContent = item;
    }

    function rollChapter() {
        let chapters = data.chapters.vanilla;
        if (enableDlcEl.checked) {
            chapters = [...data.chapters.vanilla, ...data.chapters.DLC];
        }
        const chapter = getRandomItem(chapters);
        setItem(chapterEl, chapter);
    }

    function rollClass() {
        const classes = Object.keys(data.classes);
        currentClass = getRandomItem(classes);
        setItem(classEl, currentClass);
        rollWeapons();
    }

    function rollWeapons() {
        const classData = data.classes[currentClass];
        const primary = getRandomItem(classData.primaries) || 'N/A';
        const secondary = getRandomItem(classData.secondaries) || 'N/A';
        const melee = getRandomItem(classData.melee) || 'N/A';

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
        const primary = getRandomItem(data.classes[currentClass].primaries) || 'N/A';
        setItem(primaryEl, primary);
    });
    rerollSecondaryBtn.addEventListener('click', () => {
        const secondary = getRandomItem(data.classes[currentClass].secondaries) || 'N/A';
        setItem(secondaryEl, secondary);
    });
    rerollMeleeBtn.addEventListener('click', () => {
        const melee = getRandomItem(data.classes[currentClass].melee) || 'N/A';
        setItem(meleeEl, melee);
    });
    rerollMissionBtn.addEventListener('click', rollMission);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});