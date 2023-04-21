/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
'strict';
// Data
const account1 = {
  owner: 'Soufiane Benhssain',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2022-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2023-04-18T18:49:59.371Z',
    '2023-04-20T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Siham j Benhssain',
  movements: [5000, 4000000, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 5657,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  currency: 'MAD',
  locale: 'ar-AR',
};

const accounts = [account1, account2, account3];

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

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.abs((date1 - date2) / (3600000 * 24));

  const daysPassed = Math.round(calcDaysPassed(new Date(), date));
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort = false) {
  //removes existing html in the container movements
  containerMovements.innerHTML = '';
  //loops the data table and creates new html which is then passed to the containermovement after begin
  //we used slice to make a copy of the array
  const sortedMovs = acc.movements.slice().sort((a, b) => a - b);

  const movs = sort ? sortedMovs : acc.movements;
  movs.forEach(function (mov, index) {
    const movementType = mov > 0 ? 'deposit' : 'withdrawal';
    const displayDate = formatMovementDate(
      new Date(acc.movementsDates[index]),
      acc.locale
    );
    const formatMovement = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movementType}">Operation ${
      index + 1
    } ${movementType}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatMovement}</div>
    </div>
  `;
    //this method takes the placement in which the html will be placed and the html as a string
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayDate = function () {
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    //weekday: 'short',
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    callingAccount.locale,
    options
  ).format(now);
};

const formatCurrency = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, value) => (acc += value), 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const balanceIn = acc.movements
    .filter(val => val >= 0)
    .reduce((acc, val) => acc + val, 0);

  const balanceOut = acc.movements
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);

  const interest = acc.movements
    .filter(val => val > 0)
    .map(val => (val * acc.interestRate) / 100)
    .filter(val => val >= 1)
    .reduce((acc, val) => acc + val, 0);

  labelSumIn.textContent = formatCurrency(balanceIn, acc.locale, acc.currency);

  labelSumOut.textContent = formatCurrency(
    Math.abs(balanceOut),
    acc.locale,
    acc.currency
  );

  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

let callingAccount, timer;

const updateUI = function (acc) {
  //display movements
  displayMovements(acc);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
  //display date
  displayDate();
};

const logOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    if (Number(time) === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
    // when we reach 0 stop timer and logout user
  };

  // Set time to 5 minutes
  // setTimeout(() => {}, 1000 * 60 * 5);
  let time = 60 * 5;

  // Call the timer every second
  const timer = setInterval(tick, 1000);
  tick();
  return timer;
};

//Event handler

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
    labelTimer.textContent = '';
    if (timer) clearInterval(timer);
    timer = logOutTimer();
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
    callingAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());
    clearTimeout(timer);
    timer = logOutTimer();
    updateUI(callingAccount);
  }
});

btnLoan.addEventListener('click', event => {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  console.log('sdq');
  if (
    amount > 0 &&
    callingAccount.movements.some(value => value >= amount * 0.1)
  ) {
    setTimeout(() => {
      callingAccount.movements.push(amount);
      callingAccount.movementsDates.push(new Date().toISOString());
      updateUI(callingAccount);
    }, 2500);
  }
  clearTimeout(timer);
  timer = logOutTimer();
  inputLoanAmount.value = '';
});

//state variable
let sorted = false;
btnSort.addEventListener('click', event => {
  event.preventDefault();
  displayMovements(callingAccount, !sorted);
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
//const deposits = movements.filter(value => value > 0);

//const withdrawals = movements.filter(value => value < 0);
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

/* const arrDeep = [[1, 2, 3, [10, 5, 11, [-1, 2]]], [4, 5, 6], 7, 8];
//console.log(arrDeep.flat(3));

const owners = ['Jonas', 'Soufiane', 'Saad', 'Aya'];
console.log(owners.sort());

//console.log(movements.sort());

movements.sort((a, b) => (a > b ? 1 : -1));
movements.sort((a, b) => a - b);

console.log(movements);
//  */

// //this will create 7 empty blocks
// const x = new Array(7);
// // console.log(x); // ==> Array(7) [ <7 empty slots> ]

// // the only method that can fill the empty array
// //x.fill(4);
// // console.log(x); // ==> [ 4, 4, 4, 4, 4, 4, 4 ]

// //starts after index 3 and end at 5 the final will not be included
// x.fill(1, 3, 5); // ==> Array(7) Array(7) [ <3 empty slots>, 1, 1, <2 empty slots> ]
// // console.log(x);

// //from
// //this will create an array with one in each position
// const arr1 = Array.from({ length: 7 }, () => 1);
// // console.log(arr1); // ==> Array(7) [ 1, 1, 1, 1, 1, 1, 1 ]

// const arr2 = Array.from({ length: 7 }, (_, index) => index + 1);
// // console.log(arr2); // ==> Array(7) [ 1, 2, 3, 4, 5, 6, 7 ]

// //generate an array with 100 random dice rolls
// const randomDiceRolls = Array.from({ length: 100 }, () =>
//   Math.trunc(Math.random() * 6 + 1)
// );
// //console.log(randomDiceRolls);

// //creating arrays from other things objects/maps/sets/nodeList

// // labelBalance.addEventListener('click', event => {
// //   event.preventDefault();
// //   //creating an array from the UI elements naturally queryselectorall returns a nodelist and with from method
// //   //we transform this nodelist into an array
// //   const movementsUI = Array.from(
// //     document.querySelectorAll('.movements__value')
// //   );

// //   console.log(
// //     movementsUI
// //       .map(el => Number(el.textContent.replace('€', '')))
// //       .reduce((acc, value) => acc + value, 0)
// //   );
// // });
// const bankDepositSum = accounts
//   .map(acc => acc.movements.flat())
//   .flat()
//   .filter(dip => dip >= 0)
//   .reduce((acc, dip) => acc + dip, 0);

// console.log(bankDepositSum + '$');

// //2

// const bankDip1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// //  .filter(dip => dip >= 1000).length;
// //.reduce((acc, _, index) => (acc = index) + 1, 0);

// console.log(bankDip1000);

// //3
// // returning an abject containing the sum of depositis and withdrawals
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, value) => {
//       //value > 0 ? (sums.deposits += value) : (sums.withdrawals += value);
//       sums[value > 0 ? 'deposits' : 'withdrawals'] += value;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// //console.log(deposits, withdrawals);

// //4
// // this is a nice title : This Is a Nice Title
// const titleCase = function (title) {
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'in', 'with', 'and'];
//   const titleParse = title
//     .toLowerCase()
//     .trim()
//     .split(' ')
//     .map(value => {
//       if (!exceptions.includes(value))
//         return value.replace(value[0], value[0].toUpperCase());
//       else return value;
// //     })
// //     .join(' ');
// //   //.reduce((str, value) => str + value + ' ', (str = ''));
// //   return titleParse;
// // };

// // console.log(titleCase('this is a nice title'));
// // console.log(titleCase('this is a LONG title but not too long'));
// // // console.log(titleCase('this is another title with an EXAMPLE'));

// // console.log(23 === 23.0);

// // console.log(0.1 + 0.2);

// // // console.log(+'23');

// // // // parsing

// // // console.log(Number.parseInt('30@qskjhdqsh', 10)); // ===> 30
// // // console.log(Number.parseInt('10011001', 2)); // ===> 153

// // // console.log(Number.isFinite(10 / 0)); // false infinie
// // // console.log(Number.isFinite('20')); // false not a number
// // // console.log(Number.isFinite(+'x20')); // false not a number NaN

// // // const randomInt = (min, max) =>
// // //   Math.floor(Math.random() * (max - min) + 1) + min;

// // // console.log(randomInt(10, 20));

// // // labelBalance.addEventListener('click', function () {
// // //   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
// // //     if (i % 2 === 0) row.style.backgroundColor = 'gray';
// // // //   });
// // // // });

// // // // seperators
// // // const bigNumber = 2_132_545_321_354;
// // // console.log(bigNumber); // ==> 2132545321354

// // // console.log(Number('2_300_000')); // ==> NaN

// // console.log(2 ** 53 - 1);
// // console.log(Number.MAX_SAFE_INTEGER);

// // console.log(64546542343246584684354354687354354345n);

// // // console.log(BigInt(514231321454645896546468654686546485646484646846448466));

// // console.log(20n == 20);

// // //create a date :

// // const now = new Date();

// // // console.log(now);
// // // console.log(new Date('2000/11/20'));

// // console.log(new Date(account1.movementsDates[0]));

// // console.log(new Date(2037, 11, 19, 15, 13, 05));
// // console.log(new Date(2031, 11, 35, 15, 13, 05));

// // console.log(new Date(0));
// // console.log(new Date(3 * 24 * 60 * 60 * 1000));

// // //working with dates

// // const future = new Date(2037, 11, 19, 15, 13);

// // console.log(future.getFullYear());
// // console.log(future.getMonth());
// // console.log(future.getDate());
// // // console.log(future.getHours());
// // // console.log(future.getMinutes());
// // // console.log(future.getSeconds());
// // console.log(future.toISOString());

// // console.log(Date.now());

// // future.setFullYear(2040);

// // console.log(future);

// // const future = new Date(2022, 4, 21, 20, 00, 00);

// // console.log(future);
// // console.log(+future);

// // const calcDaysPassed = (date1, date2) =>
// //   Math.abs((date1 - date2) / (3600000 * 24));

// // const date1 = calcDaysPassed(new Date(2022, 11, 01), new Date(2022, 11, 01));

// // console.log(date1);

// // Numbers internalization test

// const num = 232323232.23;

// const options = {
//   style: 'currency',
//   currency: 'USD',
//   // unit: 'miles-per-hour',
//   unit: 'celsius',
// };

// console.log(
//   'Us format : ',
//   new Intl.NumberFormat('en-GB', options).format(num)
// );
// console.log(
//   'German format : ',
//   new Intl.NumberFormat('de-DE', options).format(num)
// );
// console.log(
//   'Syria format : ',
//   new Intl.NumberFormat('ar-SY', options).format(num)
// );

// timers

// const ings = ['olives', 'cheese', 'gragas'];

// const pizzaTimer = setTimeout(
//   (ing1, ing2, ing3) =>
//     console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2} and ${ing3}`),
//   3000,
//   ...ings
// );
// console.log('Waiting...');
// if (ings.includes('gragas')) clearTimeout(pizzaTimer);

//setTimeOut
// setInterval(() => {
//   const now = new Date();
//   console.log(now.getHours(), ':', now.getMinutes(), ':', now.getSeconds());
// }, 1000);
