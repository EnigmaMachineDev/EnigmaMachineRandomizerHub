document.addEventListener('DOMContentLoaded', () => {
    const diceButtons = document.querySelectorAll('.dice-btn');
    const rollCustomBtn = document.getElementById('roll-custom');
    const numDiceInput = document.getElementById('num-dice');
    const diceSidesInput = document.getElementById('dice-sides');
    const resultEl = document.getElementById('result');
    const individualRollsEl = document.getElementById('individual-rolls');

    function rollDice(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    function displayResult(total, rolls, diceType) {
        resultEl.textContent = `Total: ${total}`;
        resultEl.style.color = '#66cc66';

        if (rolls.length > 1) {
            individualRollsEl.textContent = `Individual rolls (${diceType}): ${rolls.join(', ')}`;
            individualRollsEl.style.display = 'block';
        } else {
            individualRollsEl.textContent = `Rolled ${diceType}: ${rolls[0]}`;
            individualRollsEl.style.display = 'block';
        }
    }

    function rollMultipleDice(numDice, sides) {
        if (numDice < 1 || sides < 2) {
            resultEl.textContent = 'Invalid dice configuration';
            resultEl.style.color = '#ff6666';
            individualRollsEl.style.display = 'none';
            return;
        }

        const rolls = [];
        for (let i = 0; i < numDice; i++) {
            rolls.push(rollDice(sides));
        }

        const total = rolls.reduce((sum, roll) => sum + roll, 0);
        const diceType = numDice > 1 ? `${numDice}D${sides}` : `D${sides}`;
        
        displayResult(total, rolls, diceType);
    }

    // Standard dice button handlers
    diceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sides = parseInt(button.dataset.sides);
            rollMultipleDice(1, sides);
        });
    });

    // Custom roll handler
    rollCustomBtn.addEventListener('click', () => {
        const numDice = parseInt(numDiceInput.value);
        const sides = parseInt(diceSidesInput.value);
        rollMultipleDice(numDice, sides);
    });

    // Allow Enter key to roll custom dice
    numDiceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const numDice = parseInt(numDiceInput.value);
            const sides = parseInt(diceSidesInput.value);
            rollMultipleDice(numDice, sides);
        }
    });

    diceSidesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const numDice = parseInt(numDiceInput.value);
            const sides = parseInt(diceSidesInput.value);
            rollMultipleDice(numDice, sides);
        }
    });
});
