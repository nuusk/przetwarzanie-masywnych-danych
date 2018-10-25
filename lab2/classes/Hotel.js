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

module.exports = Hotel;