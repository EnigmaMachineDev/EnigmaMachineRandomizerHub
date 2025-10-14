document.addEventListener('DOMContentLoaded', () => {
    const spiritRollEl = document.getElementById('spirit-roll');
    const rerollSpiritBtn = document.getElementById('reroll-spirit');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            randomizeAll();
        });

    function getRandomKey(obj) {
        const keys = Object.keys(obj);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    function setSpirit() {
        const spirits = data.spirits;
        const spiritTypeKey = getRandomKey(spirits);
        const spiritType = spirits[spiritTypeKey];
        
        const spirit = spiritType[Math.floor(Math.random() * spiritType.length)];

        const spiritTypeName = spiritTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        spiritRollEl.textContent = `${spiritTypeName} -> ${spirit}`;
    }

    function randomizeAll() {
        setSpirit();
    }

    rerollSpiritBtn.addEventListener('click', setSpirit);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
