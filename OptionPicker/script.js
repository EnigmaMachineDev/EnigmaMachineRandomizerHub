document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-option');
    const pickBtn = document.getElementById('pick-option');
    const clearBtn = document.getElementById('clear-all');
    const optionInput = document.getElementById('option-input');
    const optionsList = document.getElementById('options-list');
    const resultEl = document.getElementById('result');

    let options = [];

    function renderOptions() {
        optionsList.innerHTML = '';
        options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            
            const optionText = document.createElement('span');
            optionText.textContent = option;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '×';
            removeBtn.onclick = () => removeOption(index);
            
            optionDiv.appendChild(optionText);
            optionDiv.appendChild(removeBtn);
            optionsList.appendChild(optionDiv);
        });
    }

    function addOption() {
        const value = optionInput.value.trim();
        if (value === '') {
            return;
        }
        
        options.push(value);
        optionInput.value = '';
        renderOptions();
        resultEl.textContent = '';
    }

    function removeOption(index) {
        options.splice(index, 1);
        renderOptions();
        resultEl.textContent = '';
    }

    function pickRandomOption() {
        if (options.length === 0) {
            resultEl.textContent = 'Please add at least one option';
            resultEl.style.color = '#ff6666';
            return;
        }

        const randomIndex = Math.floor(Math.random() * options.length);
        const selectedOption = options[randomIndex];
        
        resultEl.textContent = selectedOption;
        resultEl.style.color = '#66cc66';
    }

    function clearAll() {
        options = [];
        renderOptions();
        resultEl.textContent = '';
    }

    addBtn.addEventListener('click', addOption);
    pickBtn.addEventListener('click', pickRandomOption);
    clearBtn.addEventListener('click', clearAll);

    // Allow Enter key to add option
    optionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addOption();
    });
});
