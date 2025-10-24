document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-number');
    const minInput = document.getElementById('min-number');
    const maxInput = document.getElementById('max-number');
    const resultEl = document.getElementById('result');

    function generateRandomNumber() {
        const min = parseFloat(minInput.value);
        const max = parseFloat(maxInput.value);

        if (isNaN(min) || isNaN(max)) {
            resultEl.textContent = 'Please enter valid numbers';
            resultEl.style.color = '#ff6666';
            return;
        }

        if (min > max) {
            resultEl.textContent = 'Minimum must be less than or equal to maximum';
            resultEl.style.color = '#ff6666';
            return;
        }

        // Generate random number between min and max (inclusive)
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        
        resultEl.textContent = randomNum;
        resultEl.style.color = '#66cc66';
    }

    generateBtn.addEventListener('click', generateRandomNumber);

    // Allow Enter key to generate
    minInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateRandomNumber();
    });
    
    maxInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateRandomNumber();
    });
});
