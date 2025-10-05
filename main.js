const numPeopleInput = document.getElementById('numPeople');
const createInputsBtn = document.getElementById('createInputs');
const billForm = document.getElementById('billForm');
const calculateBtn = document.getElementById('calculate');
const resultDiv = document.getElementById('result');

createInputsBtn.addEventListener('click', () => {
    const numPeople = parseInt(numPeopleInput.value);
    billForm.innerHTML = '';
    resultDiv.innerHTML = '';

    if (isNaN(numPeople) || numPeople < 2) {
        alert('Enter a valid number of people (at least 2)');
        return;
    }

    for (let i = 0; i < numPeople; i++) {
        const label = document.createElement('label');
        label.textContent = `Person ${i+1} spent:`;
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.required = true;
        input.classList.add('personInput');

        billForm.appendChild(label);
        billForm.appendChild(input);
    }

    calculateBtn.style.display = 'block';
});

calculateBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.personInput');
    let total = 0;
    let amounts = [];

    inputs.forEach(input => {
        const val = parseFloat(input.value);
        if (isNaN(val) || val < 0) {
            alert('Enter valid amounts for everyone');
            return;
        }
        amounts.push(val);
        total += val;
    });

    const perPerson = total / amounts.length;

    let message = `<h2>Results:</h2>`;
    amounts.forEach((amt, i) => {
        const diff = perPerson - amt;
        if (diff > 0) {
            message += `<p>Person ${i+1} should pay ₹${diff.toFixed(2)}</p>`;
        } else if (diff < 0) {
            message += `<p>Person ${i+1} should receive ₹${Math.abs(diff).toFixed(2)}</p>`;
        } else {
            message += `<p>Person ${i+1} is settled</p>`;
        }
    });

    resultDiv.innerHTML = message;
});
