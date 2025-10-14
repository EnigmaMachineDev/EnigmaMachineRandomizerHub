document.addEventListener('DOMContentLoaded', () => {
    const beverageRollEl = document.getElementById('beverage-roll');
    const rerollBeverageBtn = document.getElementById('reroll-beverage');
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

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function setBeverage() {
        const beverageTypeKey = getRandomKey(data);
        const beverageType = data[beverageTypeKey];
        let result = '';

        const beverageTypeName = beverageTypeKey.charAt(0).toUpperCase() + beverageTypeKey.slice(1);

        if (beverageTypeKey === 'beer') {
            const styleKey = getRandomKey(beverageType);
            const style = beverageType[styleKey];
            const subStyleKey = getRandomKey(style);
            const subStyle = style[subStyleKey];
            const beer = getRandomValue(subStyle);
            result = `${beverageTypeName} -> ${styleKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> ${subStyleKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> ${beer}`;
        } else if (beverageTypeKey === 'wine') {
            const wineTypeKey = getRandomKey(beverageType);
            if (wineTypeKey === 'attributes') {
                //This is a bit of a hack to avoid selecting the attributes object as a wine type
                const wineTypes = Object.keys(beverageType).filter(k => k !== 'attributes');
                const randomWineTypeKey = wineTypes[Math.floor(Math.random() * wineTypes.length)];
                const wine = getRandomValue(beverageType[randomWineTypeKey]);
                result = `${beverageTypeName} -> ${randomWineTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> ${wine}`;
            } else {
                const wine = getRandomValue(beverageType[wineTypeKey]);
                result = `${beverageTypeName} -> ${wineTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> ${wine}`;
            }

        } else if (beverageTypeKey === 'liquor') {
            const liquorTypeKey = getRandomKey(beverageType);
            const liquorType = beverageType[liquorTypeKey];
            const liquor = getRandomValue(liquorType);
            result = `${beverageTypeName} -> ${liquorTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} -> ${liquor}`;
        }

        beverageRollEl.textContent = result;
    }

    function randomizeAll() {
        setBeverage();
    }

    rerollBeverageBtn.addEventListener('click', setBeverage);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
