var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send(table);
});

router.get('/project', function(req, res) {
  init();
  project(0);
  res.send(output);
});

var table = [
  {
    team: 'B',
    points: 24
  },
  {
    team: 'F',
    points: 24
  },
  {
    team: 'J',
    points: 22
  },
  {
    team: 'A',
    points: 20
  },
  {
    team: 'G',
    points: 19
  },
  {
    team: 'D',
    points: 19
  },
  {
    team: 'E',
    points: 18
  },
  {
    team: 'C',
    points: 17
  },
  {
    team: 'I',
    points: 15
  },
  {
    team: 'H',
    points: 14
  }
];

var fixtures = [
  {
    homeTeam: 'A',
    awayTeam: 'B'
  },
  {
    homeTeam: 'C',
    awayTeam: 'D'
  },
  {
    homeTeam: 'E',
    awayTeam: 'F'
  },
  {
    homeTeam: 'G',
    awayTeam: 'H'
  },
  {
    homeTeam: 'I',
    awayTeam: 'J'
  }
];

var outcomes = [
  [3, 0],  // home win
  [1, 1],  // draw
  [0, 3]  // home loss
];

var tieBreaker = function(a, b) {
  if (a.points === b.points) {
    return a.team - b.team;  // alphabetical order (asc)
  }
  return b.points - a.points;  // points order (desc)
};

var tableCopy = [];
var output = [];

var init = function() {
  table.sort(tieBreaker);
  tableCopy = JSON.parse(JSON.stringify(table));
  output = [];
  table.forEach(function(elem, index) {
    var outputElem = JSON.parse(JSON.stringify(elem));
    outputElem.currPos = index + 1;
    outputElem.highestPos = index + 1;
    outputElem.lowestPos = index + 1;
    output.push(outputElem);
  });
};

var project = function(index) {
  if (index >= fixtures.length) {
    return;
  }

  var currFixture = fixtures[index];
  for (var points of outcomes) {
    // TODO trim search tree if this result doesn't affect the table
    recordResult(currFixture, points);
    updatePositions();
    project(index + 1);
    undoResult(currFixture, points);
  }
};

var updatePositions = function() {
  tableCopy.forEach(function(elem, index) {
    outputTeam = output.find(function(outputElem) {
      return outputElem.team === elem.team;
    });
    var currPos = index + 1;
    outputTeam.highestPos = Math.min(currPos, outputTeam.highestPos);
    outputTeam.lowestPos = Math.max(currPos, outputTeam.lowestPos);
  });
};

var recordResult = function(fixture, points) {
  var homeTeam = tableCopy.find(function(elem) {
    return elem.team === fixture.homeTeam;
  });
  var awayTeam = tableCopy.find(function(elem) {
    return elem.team === fixture.awayTeam;
  });
  homeTeam.points += points[0];
  awayTeam.points += points[1];
  tableCopy.sort(tieBreaker);
};

var undoResult = function(fixture, points) {
  var homeTeam = tableCopy.find(function(elem) {
    return elem.team === fixture.homeTeam;
  });
  var awayTeam = tableCopy.find(function(elem) {
    return elem.team === fixture.awayTeam;
  });
  homeTeam.points -= points[0];
  awayTeam.points -= points[1];
  tableCopy.sort(tieBreaker);
};

module.exports = router;
