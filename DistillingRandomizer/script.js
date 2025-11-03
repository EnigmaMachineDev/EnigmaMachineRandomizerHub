document.addEventListener('DOMContentLoaded', () => {
    const spiritRollEl = document.getElementById('spirit-roll');
    const rerollSpiritBtn = document.getElementById('reroll-spirit');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data={};const STORAGE_KEY='distillingOptions';let options={};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();randomizeAll();
        });

    function getRandomKey(obj) {
        const keys = Object.keys(obj);
        return keys[Math.floor(Math.random() * keys.length)];
    }
    function getRandomValue(arr){return arr[Math.floor(Math.random()*arr.length)];}
    function loadOptions(){const saved=localStorage.getItem(STORAGE_KEY);if(saved){try{options=JSON.parse(saved);}catch(e){}}}
    function isEnabled(category,name){if(!options[category])return true;if(!options[category].hasOwnProperty(name))return true;return options[category][name];}
    function getEnabledItems(category){if(!data[category])return[];return data[category].filter(item=>isEnabled(category,item.name));}

    function setSpirit() {
        const spirits = data.spirits;
        const spiritTypeKey = getRandomKey(spirits);
        const spiritType = spirits[spiritTypeKey];
        
        const spiritObj = spiritType[Math.floor(Math.random() * spiritType.length)];

        const spiritTypeName = spiritTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        spiritRollEl.innerHTML = `${spiritTypeName} -> <a href="${spiritObj.info_url}" target="_blank" rel="noopener noreferrer">${spiritObj.name}</a>`;
    }

    function randomizeAll() {
        setSpirit();
    }

    rerollSpiritBtn.addEventListener('click', setSpirit);
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});
