document.addEventListener('DOMContentLoaded', () => {
    const teaRollEl = document.getElementById('tea-roll');
    const rerollTeaBtn = document.getElementById('reroll-tea');
    const generateTeaBtn = document.getElementById('generate-tea');

    let data = {};
    const STORAGE_KEY = 'teaOptions';
    let options = {};

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { options = JSON.parse(saved); }
            catch (e) { options = {}; }
        }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function getEnabledItems(category) {
        if (!data[category]) return [];
        return data[category].filter(item => isEnabled(category, item.name));
    }

    function setTea() {
        const categories = ['green_teas', 'black_teas', 'oolong_teas', 'white_teas', 'pu_erh_teas', 'herbal_teas', 'specialty_blends'];
        const availableCategories = categories.filter(cat => getEnabledItems(cat).length > 0);
        if (availableCategories.length === 0) {
            teaRollEl.innerHTML = '';
            const p = document.createElement('p');
            p.textContent = 'No teas enabled. Please enable some options.';
            teaRollEl.appendChild(p);
            return;
        }
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const enabledItems = getEnabledItems(category);
        const teaObj = getRandomValue(enabledItems);
        
        teaRollEl.innerHTML = '';
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'tea-recipe';
        
        const title = document.createElement('h3');
        title.textContent = teaObj.name;
        recipeDiv.appendChild(title);
        
        if (teaObj.origin) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Origin:';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + teaObj.origin));
            recipeDiv.appendChild(p);
        }
        
        if (teaObj.description) {
            const p = document.createElement('p');
            p.className = 'description';
            const strong = document.createElement('strong');
            strong.textContent = 'Description:';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + teaObj.description));
            recipeDiv.appendChild(p);
        }
        
        if (teaObj.brew_temp) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Brew Temperature:';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + teaObj.brew_temp));
            recipeDiv.appendChild(p);
        }
        
        if (teaObj.brew_time) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Brew Time:';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + teaObj.brew_time));
            recipeDiv.appendChild(p);
        }
        
        if (teaObj.caffeine) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Caffeine:';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + teaObj.caffeine));
            recipeDiv.appendChild(p);
        }
        
        if (teaObj.oxidation) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Oxidation Level:';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + teaObj.oxidation));
            recipeDiv.appendChild(p);
        }
        
        if (teaObj.ingredients) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Ingredients:';
            p.appendChild(strong);
            recipeDiv.appendChild(p);
            
            const ul = document.createElement('ul');
            teaObj.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient;
                ul.appendChild(li);
            });
            recipeDiv.appendChild(ul);
        }
        
        if (teaObj.instructions) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Instructions:';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + teaObj.instructions));
            recipeDiv.appendChild(p);
        }
        
        if (teaObj.info_url) {
            const p = document.createElement('p');
            p.className = 'info-link';
            const strong = document.createElement('strong');
            strong.textContent = 'Learn More:';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' '));
            
            const link = document.createElement('a');
            link.href = teaObj.info_url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Read about ' + teaObj.name;
            p.appendChild(link);
            recipeDiv.appendChild(p);
        }
        
        teaRollEl.appendChild(recipeDiv);
    }

    function randomizeAll() {
        setTea();
    }

    rerollTeaBtn.addEventListener('click', setTea);
    generateTeaBtn.addEventListener('click', randomizeAll);
});
