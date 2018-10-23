const DAYS_IN_YEAR = 365;


function getBirthdayMatchProbability(numPeople) {
  let tmp = 1;
  for (let i = DAYS_IN_YEAR; i > DAYS_IN_YEAR-numPeople; i--) {
    console.log(i);
    tmp *= i / 365;
  }
  return 1-tmp;
}

console.log(getBirthdayMatchProbability(30));