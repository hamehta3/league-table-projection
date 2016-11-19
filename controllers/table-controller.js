"use strict";

class TableController {
  constructor(table, fixtures) {
    this.table = table;
    this.fixtures = fixtures;
    this.tableCopy = [];
    this.output = [];
    this.outcomes = [
      [3, 0],  // home win
      [1, 1],  // draw
      [0, 3]  // home loss
    ];
  }
  
  /*
  * Tie break criteria:
  * 1. Points
  * 2. Name
  *
  * TODO: Add more realistic criteria like GD / Head-to-Head, GF, GA, etc.
  * This is also league specific
  */
  tieBreaker(a, b) {
    if (a.points === b.points) {
      return a.team.localeCompare(b.team);  // alphabetical order (asc)
    }
    return b.points - a.points;  // points order (desc)
  }

  validate() {
    // TODO make sure the table and fixtures are consistent
    return true;
  }

  validateTable(table) {
    if (!Array.isArray(table)) {
      return false;
    }
    for (let i=0; i<table.length; i++) {
      let elem = table[i];
      if (!elem.team || (typeof elem.team !== 'string')) {
        return false;
      }
      if (!elem.points || (typeof elem.points !== 'number')) {
        return false;
      }
    }
    return true;
  }

  validateFixtures(fixtures) {
    if (!Array.isArray(fixtures)) {
      return false;
    }
    for (let i=0; i<fixtures.length; i++) {
      let fixture = fixtures[i];
      if (!fixture.homeTeam || typeof fixture.homeTeam != 'string') {
        return false;
      }
      if (!fixture.awayTeam || typeof fixture.awayTeam != 'string') {
        return false;
      }
    }
    return true;
  }

  initOutput() {
    this.table.sort(this.tieBreaker);
    this.tableCopy = JSON.parse(JSON.stringify(this.table));
    this.output = [];
    let output = this.output;
    this.table.forEach(function(elem, index) {
      let outputElem = JSON.parse(JSON.stringify(elem));
      outputElem.currPos = index + 1;
      outputElem.highestPos = index + 1;
      outputElem.lowestPos = index + 1;
      output.push(outputElem);
    });
  }

  // Main routine
  project(index) {
    if (index >= this.fixtures.length) {
      return;
    }

    let currFixture = this.fixtures[index];
    for (let points of this.outcomes) {
      // TODO trim search tree if this result doesn't affect the table
      this.recordResult(currFixture, points);
      this.updatePositions();
      this.project(index + 1);
      this.undoResult(currFixture, points);
    }
  }

  updatePositions() {
    let output = this.output;
    this.tableCopy.forEach(function(elem, index) {
      let outputTeam = output.find(function(outputElem) {
        return outputElem.team === elem.team;
      });
      let currPos = index + 1;
      outputTeam.highestPos = Math.min(currPos, outputTeam.highestPos);
      outputTeam.lowestPos = Math.max(currPos, outputTeam.lowestPos);
    });
  }

  recordResult(fixture, points) {
    let homeTeam = this.tableCopy.find(function(elem) {
      return elem.team === fixture.homeTeam;
    });
    let awayTeam = this.tableCopy.find(function(elem) {
      return elem.team === fixture.awayTeam;
    });
    homeTeam.points += points[0];
    awayTeam.points += points[1];
    this.tableCopy.sort(this.tieBreaker);
  };

  undoResult(fixture, points) {
    let homeTeam = this.tableCopy.find(function(elem) {
      return elem.team === fixture.homeTeam;
    });
    let awayTeam = this.tableCopy.find(function(elem) {
      return elem.team === fixture.awayTeam;
    });
    homeTeam.points -= points[0];
    awayTeam.points -= points[1];
    this.tableCopy.sort(this.tieBreaker);
  };
}

module.exports = TableController;