'strict';

const julia = [3, 5, 2, 12, 7];

const kate = [4, 1, 15, 8, 3];

const checkDogs = function (juliaArr, kateArr) {
  let correctedArray = juliaArr.slice(1, -2).concat(kateArr);
  correctedArray.forEach(function (dog, index) {
    dog >= 3
      ? console.log(
          `Dog number ${index + 1} is an adult, and is ${dog} years old !`
        )
      : console.log(`Dog number ${index + 1} is still a puppy`);
  });
}; //([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const calcAverageHumanAge = (function (dogs) {
  const dogHumanAge = dogs
    .map(value => (value <= 2 ? 2 * value : 16 + value * 4))
    .filter(value => value >= 18)
    .reduce((acc, value, i, array) => acc + value / array.length, 0);

  // console.log(dogHumanAge);
})([11, 11, 11, 11, 11]); // => outputs 60
// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add
// it to the object as a new property. Do NOT create a new array, simply loop over the array.
// Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

// HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

// TEST DATA:

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 300, owners: ['Michael'] },
  { weight: 32, curFood: 350, owners: ['Soufiane'] },
  { weight: 40, curFood: 420, owners: ['Aya'] },
  { weight: 40, curFood: 500, owners: ['Saad'] },
];

dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);

// console.log(dogs);

console.log(dogs);

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood + dog.recommendedFood * 0.1)
  .reduce((str, value, index, arr) => {
    const owners = value.owners.join(' and ');
    str += ' and ' + owners;
    if (index === arr.length - 1)
      str = str.replace(' and ', '').concat("'s dogs eat too much!");
    return str;
  }, '');

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood - dog.recommendedFood * 0.1)
  .reduce((str, value, index, arr) => {
    const owners = value.owners.join(' and ');
    str += ' and ' + owners;
    if (index === arr.length - 1)
      str = str.replace(' and ', '').concat("'s dogs eat too little!");
    return str;
  }, '');

console.log(ownersEatTooLittle);
console.log(ownersEatTooMuch);

console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

console.log(
  dogs.some(
    dog =>
      dog.curFood < dog.recommendedFood + dog.recommendedFood * 0.1 &&
      dog.curFood > dog.recommendedFood - dog.recommendedFood * 0.1
  )
);

const okayAmount = dogs.filter(
  dog =>
    dog.curFood < dog.recommendedFood + dog.recommendedFood * 0.1 &&
    dog.curFood > dog.recommendedFood - dog.recommendedFood * 0.1
);

console.log(...okayAmount);

const sortedDogs = dogs
  .slice()
  .sort((a, b) => a.recommendedFood > b.recommendedFood);

console.log(sortedDogs);
