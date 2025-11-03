document.addEventListener('DOMContentLoaded', () => {
    const pactEl = document.getElementById('pact');
    const armorEl = document.getElementById('armor');
    const primaryEl = document.getElementById('primary');
    const secondaryEl = document.getElementById('secondary');

    const pactLink = document.getElementById('pact-link');
    const armorLink = document.getElementById('armor-link');
    const primaryLink = document.getElementById('primary-link');
    const secondaryLink = document.getElementById('secondary-link');

    const rerollPactBtn = document.getElementById('reroll-pact');
    const rerollArmorBtn = document.getElementById('reroll-armor');
    const rerollPrimaryBtn = document.getElementById('reroll-primary');
    const rerollSecondaryBtn = document.getElementById('reroll-secondary');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let data={};const STORAGE_KEY='soulframeOptions';let options={};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();randomizeAll();
        });

    function getRandomItem(category) {
        function getRandomValue(arr){return arr[Math.floor(Math.random()*arr.length)];}
        function loadOptions(){const saved=localStorage.getItem(STORAGE_KEY);if(saved){try{options=JSON.parse(saved);}catch(e){}}}
        function isEnabled(category,name){if(!options[category])return true;if(!options[category].hasOwnProperty(name))return true;return options[category][name];}
        function getEnabledItems(category){if(!data[category])return[];return data[category].filter(item=>isEnabled(category,item.name));}

        const items = getEnabledItems(category);
        return getRandomValue(items);
    }

    function setItem(element, linkElement, category) {
        const item = getRandomItem(category);
        element.textContent = item.name;
        linkElement.href = item.link;
    }

    function randomizeAll() {
        setItem(pactEl, pactLink, 'Pact');
        setItem(armorEl, armorLink, 'Armor');
        setItem(primaryEl, primaryLink, 'Primary');
        setItem(secondaryEl, secondaryLink, 'Secondary');
    }

    rerollPactBtn.addEventListener('click', () => setItem(pactEl, pactLink, 'Pact'));
    rerollArmorBtn.addEventListener('click', () => setItem(armorEl, armorLink, 'Armor'));
    rerollPrimaryBtn.addEventListener('click', () => setItem(primaryEl, primaryLink, 'Primary'));
    rerollSecondaryBtn.addEventListener('click', () => setItem(secondaryEl, secondaryLink, 'Secondary'));
    generateLoadoutBtn.addEventListener('click', randomizeAll);
});