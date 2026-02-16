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
        if (!spirits) {
            spiritRollEl.textContent = 'No spirits available';
            return;
        }
        
        // Collect all enabled spirits from all categories
        const allEnabledSpirits = [];
        Object.keys(spirits).forEach(spiritTypeKey => {
            const spiritType = spirits[spiritTypeKey];
            const enabledSpirits = spiritType.filter(spirit => isEnabled(spiritTypeKey, spirit.name));
            enabledSpirits.forEach(spirit => {
                allEnabledSpirits.push({
                    spirit: spirit,
                    spiritTypeKey: spiritTypeKey
                });
            });
        });
        
        if (allEnabledSpirits.length === 0) {
            spiritRollEl.textContent = 'No spirits selected';
            return;
        }
        
        // Pick a random enabled spirit
        const selected = allEnabledSpirits[Math.floor(Math.random() * allEnabledSpirits.length)];
        const spiritTypeName = selected.spiritTypeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        spiritRollEl.innerHTML = `${spiritTypeName} -> <a href="${selected.spirit.info_url}" target="_blank" rel="noopener noreferrer">${selected.spirit.name}</a>`;
    }

    function randomizeAll() {
        setSpirit();
    }

    rerollSpiritBtn.addEventListener('click', setSpirit);
    generateLoadoutBtn.addEventListener('click', randomizeAll);

    function copyResults() {
        const sections = document.querySelectorAll('.container > .section');
        const lines = [];
        sections.forEach(section => {
            if (section.style.display === 'none') return;
            const header = section.querySelector('.section-header h2');
            if (!header) return;
            const label = header.textContent.trim();
            const itemContainer = section.querySelector('.item-container');
            if (!itemContainer) return;
            // Check for list items
            const listItems = itemContainer.querySelectorAll('li');
            let value = '';
            if (listItems.length > 0) {
                const items = Array.from(listItems).map(li => li.textContent.trim());
                value = items.join(', ');
            } else {
                value = itemContainer.textContent.trim();
            }
            if (value) {
                lines.push(label + ': ' + value);
            }
        });
        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-results');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
    }

    document.getElementById('copy-results').addEventListener('click', copyResults);
});
