'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// following are the different account objects that contain the account details of some account holders
const account1 = {
  owner: 'Shubham Kandpal',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Radha Mohan',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Jai Kishan',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Rudraksh',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

// accounts array that contain all arrays at a time
const accounts = [account1, account2, account3, account4];
// movement is the array of arrays containing movements in different in different accounts
const movement = account1.movements;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

// Bankist App

// Once again a taste of DOM Manipulation

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawl';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}₤</div>
        </div>
    `;
    // We are using here insertAdjacentHTML method to attach the element "html" to the "movement" element
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements)
// console.log(containerMovements.innerHTML)

// To display balance
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}₤`;
};
// calcDisplayBalance(account1.movements)

// Display Summary
const calcDisplaySummary = function (acc) {
  // income
  const incomes = acc.movements
    .filter(amt => amt > 0)
    .reduce((acc, amt) => acc + amt);
  labelSumIn.textContent = `${incomes}₤`;

  // expenditure
  const out = acc.movements
    .filter(amt => amt < 0)
    .reduce((acc, amt) => acc + amt);
  labelSumOut.textContent = `${Math.abs(out)}₤`;

  // interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(int)
      return int >= 1;
    })
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `${interest}`;
};
// calcDisplaySummary(account1.movements)

////////////////////////////

// Login functionalities in the front page

// Update UI
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  // console.log("LOGIN"); // it just displays for a moment because this button is from inside the form and it is the default property of HTML forms to refresh webpage when one clicks on submit button and that's why we used "preventDefault()"

  // now we find the account that has been loginned in the "accounts" array using the "find" method
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // console.log(currentAccount);

  // matching the pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // think why we used "?" in front of currentAccount

    // opacity === 100
    containerApp.style.opacity = 100;

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});

///////////////////////////

// Transfer money from one account to another

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e);
  const user = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === user);

  // blurring the entered values
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username
  ) {
    // changing the "movements" array of the "sender"
    currentAccount.movements.push(-1 * amount);

    // changing the "movements" array of the "receiver"
    receiverAcc.movements.push(amount);
    // console.log(receiverAcc.movements);

    // console.log(currentAccount, receiverAcc)
    updateUI(currentAccount);
    // updateUI(receiverAcc);
  }
});

// This function creates username
const createUsername = function (acc) {
  acc.forEach(function (accs) {
    accs.username = accs.owner
      .toLowerCase()
      .split(' ')
      .map(val => val[0])
      .join('');
  });
};
createUsername(accounts);
