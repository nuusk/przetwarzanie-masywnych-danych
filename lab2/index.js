const Simulation = require('./classes/Simulation');

// The number of people in the simulation
const NUM_SIMULATIONS = 10;

// (numPeople, probability, numHotels, numDays)
const app = new Simulation(10000, 0.1, 100, 100);

for (let i=0; i<NUM_SIMULATIONS; i++) {
  app.run();
  app.printSimulationResults(i);
  app.resetSimulation();
}

app.printAverageResults(NUM_SIMULATIONS);