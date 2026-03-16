document.addEventListener('DOMContentLoaded', () => {
    let data = {};

    fetch('randomizer.json')
        .then(res => res.json())
        .then(jsonData => {
            data = jsonData;
        });

    function pickRandom() {
        if (!data.restaurants || data.restaurants.length === 0) return;
        const pick = data.restaurants[Math.floor(Math.random() * data.restaurants.length)];
        showResult(pick);
    }

    function showResult(pick) {
        const container = document.getElementById('result-container');
        container.innerHTML = '';

        const section = document.createElement('div');
        section.className = 'section';

        const header = document.createElement('div');
        header.className = 'section-header';
        const h2 = document.createElement('h2');
        h2.textContent = 'Your Restaurant';
        const rerollBtn = document.createElement('button');
        rerollBtn.className = 'reroll-btn';
        rerollBtn.textContent = '↻';
        rerollBtn.title = 'Pick again';
        rerollBtn.addEventListener('click', pickRandom);
        header.appendChild(h2);
        header.appendChild(rerollBtn);

        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';

        const link = document.createElement('a');
        link.href = pick.url;
        link.className = 'result-single';
        link.textContent = pick.name + ' →';
        link.style.textDecoration = 'underline';
        link.style.color = 'inherit';

        itemContainer.appendChild(link);
        section.appendChild(header);
        section.appendChild(itemContainer);
        container.appendChild(section);
    }

    document.getElementById('generate-btn').addEventListener('click', pickRandom);
});
