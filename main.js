document.addEventListener('DOMContentLoaded', function() {
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
            input.step = "0.01";
            input.required = true;
            input.classList.add('personInput');

            billForm.appendChild(label);
            billForm.appendChild(document.createElement('br'));
            billForm.appendChild(input);
            billForm.appendChild(document.createElement('br'));
        }

        calculateBtn.style.display = 'block';
    });

    calculateBtn.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.personInput');
        let total = 0;
        let amounts = [];
        let hasError = false;

        for (let input of inputs) {
            const val = parseFloat(input.value);
            if (isNaN(val) || val < 0) {
                alert('Enter valid amounts for everyone');
                hasError = true;
                break;
            }
            amounts.push(val);
            total += val;
        }

        if (hasError) return;

        const perPerson = total / amounts.length;

        const balances = amounts.map((amt, i) => ({
            person: i + 1,
            paid: amt,
            balance: amt - perPerson,
            owes: [],
            receives: []
        }));

        const debtors = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
        const creditors = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);

        let debtorIndex = 0;
        let creditorIndex = 0;

        while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
            const debtor = debtors[debtorIndex];
            const creditor = creditors[creditorIndex];
            
            const debt = Math.min(-debtor.balance, creditor.balance);
            
            debtor.owes.push({ to: creditor.person, amount: debt });
            creditor.receives.push({ from: debtor.person, amount: debt });
            
            debtor.balance += debt;
            creditor.balance -= debt;
            
            if (Math.abs(debtor.balance) < 0.01) debtorIndex++;
            if (creditor.balance < 0.01) creditorIndex++;
        }

        let message = `<h2>Results:</h2>`;
        message += `<p><strong>Total: ₹${total.toFixed(2)}</strong></p>`;
        message += `<p><strong>Each person should pay: ₹${perPerson.toFixed(2)}</strong></p>`;
        message += `<h3>Settlement:</h3>`;
        
        let hasTransactions = false;
        balances.forEach(person => {
            if (person.owes.length > 0) {
                hasTransactions = true;
                message += `<p><strong>Person ${person.person}</strong> (paid ₹${person.paid.toFixed(2)}) needs to pay:</p><ul>`;
                person.owes.forEach(owe => {
                    message += `<li>₹${owe.amount.toFixed(2)} to Person ${owe.to}</li>`;
                });
                message += `</ul>`;
            }
        });

        if (!hasTransactions) {
            message += `<p>Everyone is settled! No payments needed.</p>`;
        }

        resultDiv.innerHTML = message;
    });
});
