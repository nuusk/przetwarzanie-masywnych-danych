const PERFORMANCE_MODE = true;

// The number of people in the simulation
const numPeople = 10000;

// The probability of staying in the hotel (for each person)
const hotelSleepProb = 0.1;

// The number of hotels
const numHotels = 100;

// The number of days in the simulation
const numDays = 100;

let currentDay = 0;
let DEBUG_totalHotelNights = 0;

// hashmap "A B": x, where A and B are people's ID, and x is the number of meetings in the same hotel
let matches = {};

// Just a set of suspects (since one suspect can be in a pair with many diffrent people)
let suspects = new Set();

// Number of pairs
let numPairs = 0;

let countMatchingSuspectsAndHotel = 0;

function matchPeople(personA, personB) {
  // Additional functionality to make sure matching is sorted (so always A is lower than B)
  let A = personA;
  let B = personB;
  
  if (!PERFORMANCE_MODE) {
    A = Math.min(personA, personB);
    B = A === personA ? personB : personA;
  }

  const matchKey = `${A} ${B}`;
  // console.log(`[${currentDay}] new Match`, matchKey);

  if (!matches[matchKey]) {
    matches[matchKey] = 1;
  } else {
    matches[matchKey]++;
  }

  // Adding new suspects
  if (matches[matchKey] >= 2) {
    suspects.add(A);
    suspects.add(B);
  }
}

function combination(n, k) {
  let tmp = 1;

  for (let i = k+1; i <= n; i++) {
    tmp *= i;
  }

  for (let i = 1; i <= n-k; i++) {
    tmp /= i;
  }

  return tmp;
}

class Person {
  constructor(personID) {
    this.ID = personID;
  }
}

class Hotel {
  constructor(hotelID, numDays) {
    this.ID = hotelID;

    // Each element in this array represents the set os people that are visiting this hotel each given day
    this.visitors = [];
    for (let i=0; i<numDays; i++) {
      this.visitors[i] = [];
    }
  }

  hostPerson(day, personID) {
    this.visitors[day].push(personID);
  }

  sortVisitors(day) {
    this.visitors[day].sort((a,b) => a-b);
  }
}

let people = [];
for (let i=0; i<numPeople; i++) {
  people.push(new Person(i));
}
let hotels = [];
for (let i=0; i<numHotels; i++) {
  hotels.push(new Hotel(i, numDays));
}

while(currentDay < numDays) {
  console.log(`~~ Starting day number ${currentDay}. ~~`);

  people.forEach((person, personIndex) => {
    const tmpProb = Math.random();
    if (tmpProb < hotelSleepProb) {
      // This person is staying at the hotel. Now he randomly choses one of the hotels
      const randHotel = Math.floor(Math.random()*numHotels);
      
      hotels[randHotel].hostPerson(currentDay, personIndex);

      DEBUG_totalHotelNights++;
    }
  });

  hotels.forEach((hotel, hotelIndex) => {
    // Sort visitors so later we can arrenge meetings with ascending order, preventing the need of duplicating meetings for each pair of people (since Person A ID will always be lower than Person B ID)
    hotel.sortVisitors(currentDay);

    // console.log('~~~~ analysing hotel' ,hotelIndex /*,  hotel.visitors[currentDay]*/ );
    for (let i=0; i<hotel.visitors[currentDay].length; i++) {
      for(let j=i+1; j<hotel.visitors[currentDay].length; j++) {
        matchPeople(hotel.visitors[currentDay][i], hotel.visitors[currentDay][j]);
      }
    }
    hotel.visitors[currentDay].forEach(visitor => {

    });
  });

  // console.log(matches);

  currentDay++;
}

// console.log(`[DEBUG] Overall, people stayed at hotel ${DEBUG_totalHotelNights} times during all nights combined.`);
// console.log(`[DEBUG] That is ${DEBUG_totalHotelNights/(numPeople*numDays)} percentage, compare it with ${hotelSleepProb}.`);

// console.log(`Final matching hashmap`);
// console.log(matches);

let histogram = [];
for (i in matches) {
  if (!histogram[matches[i]]) {
    histogram[matches[i]] = 0;
  }
  histogram[matches[i]]++;
}

// Counting the pairs and matching suspects & pairs
for (let meetingsNumber = 2; meetingsNumber < histogram.length; meetingsNumber++) {
  numPairs += histogram[meetingsNumber];
}

// for (let i=2; i<histogram.length; i++) {
//   histogram[i]
// }

// Counting pairs&days, which is the number of combination of pairs
for (let meetingsNumber = 2; meetingsNumber < histogram.length; meetingsNumber++) {
  countMatchingSuspectsAndHotel += combination(meetingsNumber, 2) * histogram[meetingsNumber];
}

console.log(histogram);

// The answer is written in polish because the classes are also in polish
console.log(`Podejrzanych par jest ${numPairs}`);
console.log(`Licznik "par i dni" wynosi ${countMatchingSuspectsAndHotel}`);
console.log(`Wszystkich podejrzanych jest łącznie ${suspects.size}`);
