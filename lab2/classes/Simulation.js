const Person = require('./Person');
const Hotel = require('./Hotel');

const combination = require('../utilities/combinatorics').combination;
const AVERAGE_HISTOGRAM_LENGTH = 5;

class Simulation {
  constructor(numPeople, hotelSleepProb, numHotels, numDays) {
    this.numPeople = numPeople;
    this.hotelSleepProb = hotelSleepProb;
    this.numHotels = numHotels;
    this.numDays  = numDays;

    this.SIMULATIONS_histogram = [];
    this.SIMULATIONS_numPairs = [];
    this.SIMULATIONS_countMatchingSuspectsAndHotel = [];
    this.SIMULATIONS_numSuspects = [];

    this.simulationNumber = 0;

    this.matches = {};

    this.resetSimulation();
  }

  resetSimulation() {
    this.people = [];
    for (let i=0; i<this.numPeople; i++) {
      this.people.push(new Person());
    }

    this.hotels = [];
    for (let i=0; i<this.numHotels; i++) {
      this.hotels.push(new Hotel(i, this.numDays));
    }

    this.currentDay = 0;
  }

  matchPeople(personA, personB) {
    // Additional functionality to make sure matching is sorted (so always A is lower than B)
    let A = personA;
    let B = personB;
    
    const matchKey = `${A} ${B}`;
    // console.log(`[${this.currentDay}] new Match`, matchKey);
  
    if (!this.matches[matchKey]) {
      this.matches[matchKey] = 1;
    } else {
      this.matches[matchKey]++;
    }
  
    // Adding new suspects
    if (this.matches[matchKey] >= 2) {
      this.suspects.add(A);
      this.suspects.add(B);
    }
  }

  run() {
    let currentSimulationHistogram = [];

    // hashmap "A B": x, where A and B are people's ID, and x is the number of meetings in the same hotel
    this.matches = {};

    // Just a set of suspects (since one suspect can be in a pair with many diffrent people)
    this.suspects = new Set();

    // Number of pairs
    let numPairs = 0;

    // Count 
    let countMatchingSuspectsAndHotel = 0;

    while(this.currentDay < this.numDays) {
      // console.log(`~~ Starting day number ${this.currentDay}. ~~`);

      this.people.forEach((person, personIndex) => {
        const tmpProb = Math.random();
        if (tmpProb < this.hotelSleepProb) {
          // This person is staying at the hotel. Now he randomly choses one of the hotels
          const randHotel = Math.floor(Math.random() * this.numHotels);
          
          this.hotels[randHotel].hostPerson(this.currentDay, personIndex);
        }
      });

      this.hotels.forEach((hotel, hotelIndex) => {
        // Sort visitors so later we can arrenge meetings with ascending order, preventing the need of duplicating meetings for each pair of people (since Person A ID will always be lower than Person B ID)
        hotel.sortVisitors(this.currentDay);
    
        // console.log('~~~~ analysing hotel' ,hotelIndex /*,  hotel.visitors[currentDay]*/ );
        for (let i=0; i<hotel.visitors[this.currentDay].length; i++) {
          for(let j=i+1; j<hotel.visitors[this.currentDay].length; j++) {
            this.matchPeople(hotel.visitors[this.currentDay][i], hotel.visitors[this.currentDay][j]);
          }
        }
      });

      this.currentDay++;
    }

    for (let matchKey in this.matches) {
      if (!currentSimulationHistogram[this.matches[matchKey]]) {
        currentSimulationHistogram[this.matches[matchKey]] = 0;
      }
      currentSimulationHistogram[this.matches[matchKey]]++;
    }

    // Counting the pairs and matching suspects & pairs
    for (let meetingsNumber = 2; meetingsNumber < currentSimulationHistogram.length; meetingsNumber++) {
      numPairs += currentSimulationHistogram[meetingsNumber];
    }

    // Counting pairs&days, which is the number of combination of pairs
    for (let meetingsNumber = 2; meetingsNumber < currentSimulationHistogram.length; meetingsNumber++) {
      countMatchingSuspectsAndHotel += combination(meetingsNumber, 2) * currentSimulationHistogram[meetingsNumber];
    }

    this.SIMULATIONS_histogram.push(currentSimulationHistogram);
    this.SIMULATIONS_numPairs.push(numPairs);
    this.SIMULATIONS_countMatchingSuspectsAndHotel.push(countMatchingSuspectsAndHotel);
    this.SIMULATIONS_numSuspects.push(this.suspects.size);

    this.simulationNumber++;
  }

  printSimulationResults(simulationNumber) {
    // The answer is written in polish because the classes are also in polish
    console.log(`\n~~~ WYNIKI SYMULACJI nr ${simulationNumber} ~~~ `);

    console.log('Histogram: ');
    for (let i = 1; i < this.SIMULATIONS_histogram[simulationNumber].length; i++) {
      console.log(`[${i}] -> ${this.SIMULATIONS_histogram[simulationNumber][i]}`);
    }
    console.log(`Podejrzanych par jest ${this.SIMULATIONS_numPairs[simulationNumber]}`);
    console.log(`Licznik "par i dni" wynosi ${this.SIMULATIONS_countMatchingSuspectsAndHotel[simulationNumber]}`);
    console.log(`Wszystkich podejrzanych jest łącznie ${this.SIMULATIONS_numSuspects[simulationNumber]}\n`);
  }

  printAverageResults(numSimulations) {
    let averageHistogram = [];
    for (let i = 0; i <= AVERAGE_HISTOGRAM_LENGTH; i++) {
      averageHistogram[i] = 0;
    }
    let averageNumPairs = 0;
    let averageCountPairsAndDays = 0;
    let averageNumSuspects = 0;

    for (let i = 0; i < numSimulations; i++) {
      for (let j = 1; j < this.SIMULATIONS_histogram[i].length; j++) {
        averageHistogram[j] += this.SIMULATIONS_histogram[i][j];
      }

      averageNumPairs += this.SIMULATIONS_numPairs[i];
      averageCountPairsAndDays += this.SIMULATIONS_countMatchingSuspectsAndHotel[i];
      averageNumSuspects += this.SIMULATIONS_numSuspects[i];
    }

    console.log(`\n~~~ ŚREDNIE WYNIKI SYMULACJI ~~~ `);
    console.log('Średni histogram: ');
    for (let i = 1; i < averageHistogram.length; i++) {
      console.log(`[${i}] -> ${averageHistogram[i]/numSimulations}`);
    }
    console.log(`Średnio podejrzanych par jest ${Math.round(100 * averageNumPairs/numSimulations) / 100}`);
    console.log(`Średnio licznik "par i dni" wynosi ${Math.round(100 * averageCountPairsAndDays/numSimulations) / 100}`);
    console.log(`Średnio wszystkich podejrzanych jest łącznie ${Math.round(100 * averageNumSuspects/numSimulations) / 100}\n`);
  }
}

module.exports = Simulation;