'strict';

const julia = [3, 5, 2, 12, 7];

const kate = [4, 1, 15, 8, 3];

const checkDogs = (function (juliaArr, kateArr) {
  let correctedArray = juliaArr.slice(1, -2).concat(kateArr);
  correctedArray.forEach(function (dog, index) {
    dog >= 3
      ? console.log(
          `Dog number ${index + 1} is an adult, and is ${dog} years old !`
        )
      : console.log(`Dog number ${index + 1} is still a puppy`);
  });
})([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
