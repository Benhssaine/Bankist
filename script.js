/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
'strict';
// Data
const account1 = {
  owner: 'Soufiane Benhssain',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const createUsernames = (function (accs) {
  accs.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(str => str[0])
      .join('');
  });
})(accounts);

const displayMovements = function (movement, sort = false) {
  //removes existing html in the container movements
  containerMovements.innerHTML = '';
  //loops the data table and creates new html which is then passed to the containermovement after begin
  //we used slice to make a copy of the array
  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;

  movs.forEach(function (mov, index) {
    const movementType = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movementType}">Operation ${
      index + 1
    } ${movementType}</div>
      <div class="movements__value">${mov}€</div>
    </div>
  `;
    //this method takes the placement in which the html will be placed and the html as a string
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, value) => (acc += value), 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const balanceIn = acc.movements
    .filter(val => val >= 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${balanceIn}€`;

  const balanceOut = acc.movements
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(balanceOut)}€`;

  const interest = acc.movements
    .filter(val => val > 0)
    .map(val => (val * acc.interestRate) / 100)
    .filter(val => val >= 1)
    .reduce((acc, val) => acc + val, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

//Event handler
let callingAccount;

btnLogin.addEventListener('click', event => {
  //prevent form from submitting and refreshing page
  event.preventDefault();
  //this will return an object
  callingAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //the callingAccount will stay undefined if the username is uncorrect or not found so without the two we cant loging
  if (callingAccount?.pin === Number(inputLoginPin.value)) {
    //splits the string based on space, and we only choose the first element
    labelWelcome.textContent = `Welcome back, ${
      callingAccount.owner.split(' ')[0]
    }`;
    //this will change the opacity therefore we will be able to see the app
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    //loses focus on the pin after pressing enter
    inputLoginPin.blur();

    updateUI(callingAccount);
  }
});

btnTransfer.addEventListener('click', event => {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    //account existence
    recieverAccount &&
    callingAccount.balance >= amount &&
    // if the username doesnt exist everything fials
    recieverAccount?.username !== callingAccount.username
  ) {
    callingAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    updateUI(callingAccount);
  }
});

btnLoan.addEventListener('click', event => {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    callingAccount.movements.some(value => value >= amount * 0.1)
  ) {
    callingAccount.movements.push(amount);
    updateUI(callingAccount);
    inputLoanAmount.value = '';
  }
});

//state variable
let sorted = false;
btnSort.addEventListener('click', event => {
  event.preventDefault();
  console.log(sorted);
  displayMovements(callingAccount.movements, !sorted);
  //flipping variable state
  sorted = !sorted;
});

btnClose.addEventListener('click', event => {
  event.preventDefault();
  const closeUsername = accounts.find(
    acc => acc?.username === inputCloseUsername.value
  );
  console.log(closeUsername);
  if (
    closeUsername?.username === callingAccount?.username &&
    callingAccount?.pin === Number(inputClosePin.value)
  ) {
    accounts.splice(
      accounts.findIndex(
        username => username?.username === callingAccount.username
      ),
      1
    );
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/* const allAccountsMovements = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, value) => acc + value, 0);
console.log(allAccountsMovements); // returns the value of all movements of all accounts the sum

const allAccountsMovements1 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, value) => acc + value, 0);
console.log(allAccountsMovements1);
 */
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroUSD = 1.1;

const movementsUsd = movements.map(movement => (movement *= euroUSD));

//console.log(movementsUsd, movements);

const movementsLog = movements.map((mov, index) => {
  return `Movement ${index + 1} : You ${
    mov > 0 ? 'deposited' : 'withdrew'
  } ${Math.abs(mov)}`;
});

// filters all the negative values, if the conditions is
// true it returns the value.
const deposits = movements.filter(value => value > 0);

const withdrawals = movements.filter(value => value < 0);
//console.log(deposits, withdrawals);

// accumulator -> SnowBall
/* const balance = movements.reduce(
  (acc, value, index, array) => (acc += value)
  //3000 // initializing the accumulator
); */

const max = movements.reduce((acc, value) => {
  if (acc < value) acc = value;
  return acc;
}, movements[0]);

//console.log(max);

const euroToUsd = 1.1;

totalDipositsInUSD = movements
  .filter(value => value > 0)
  .map(value => value * euroToUsd)
  /*.map((value, i, arr) => {
    console.log(arr);
    return value * euroToUsd;
  })*/
  .reduce((acc, value) => acc + value, 0);
/* 
console.log(movements); // Array(8) [ 200, 450, -400, 3000, -650, -130, 70, 1300 ]
console.log(movements.find(value => value < 0)); // ==> outputs -400

console.log(accounts);
console.log(accounts.find(acc => acc.owner === 'Jessica Davis')); // ==> returns the object container owner JS

 */
// this tests if there was any deposit into the account => true
/* console.log(movements.some(val => val > 0));
// this tests if there was any deposit above 5k in the account => false
console.log(movements.some(val => val > 5000));

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//Seperate callBack
const deposit = mov => mov > 0;

console.log(movements.filter(deposit)); // ==> Array(5) [ 200, 450, 3000, 70, 1300 ]
console.log(movements.some(deposit)); // ==> true
console.log(movements.every(deposit)); // ==> false */

//console.log(movementsLog);
/////////////////////////////////////////////////

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
//console.log(arr.flat()); // ==> Array(8) [ 1, 2, 3, 4, 5, 6, 7, 8 ]

const arrDeep = [[1, 2, 3, [10, 5, 11, [-1, 2]]], [4, 5, 6], 7, 8];
//console.log(arrDeep.flat(3));

const owners = ['Jonas', 'Soufiane', 'Saad', 'Aya'];
console.log(owners.sort());

//console.log(movements.sort());

movements.sort((a, b) => (a > b ? 1 : -1));
movements.sort((a, b) => a - b);

console.log(movements);
