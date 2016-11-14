var express = require('express');
var router = express.Router();

var errorNotSupported = { error: 'Content Type not supported' };
var errorInternal = { error: 'An internal error occurred' };

// Middleware
router.use(function(req, res, next) {
  if (req.path === '/') {
    return next();
  }
  if ((req.method === 'POST' || req.method === 'PUT') && !req.is('json')) {
    res.send(errorNotSupported);
    return;
  }
  res.set('Content-Type', 'application/json');
  next();
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',{ title: 'League Table Projection', table: 'Table',
             fixtures: 'Fixtures', project: 'Project' });
});

router.get('/table', function(req, res) {
  res.send(table.sort(tieBreaker));
});

router.post('/table', function(req, res) {
  if (!req.body || !validateTable(req.body)) {
    res.send(errorInternal);
  } else {
    table = req.body;
    res.send(table);
  }
});

router.get('/fixtures', function(req, res) {
  res.send(fixtures);
});

router.post('/fixtures', function(req, res) {
  if (!req.body || !validateFixtures(req.body)) {
    res.send(errorInternal);
  } else {
    fixtures = req.body;
    res.send(fixtures);
  }
});

router.get('/table/project', function(req, res) {
  validate();
  initOutput();
  try {
    project(0);
    res.send(output);
  } catch(e) {
    console.error(e);
    res.send(errorInternal);
  }
});

// TODO add support to read data for different leagues

// TODO move this to a unit test to use as mock data
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

var validate = function() {
  // TODO - make sure the table and fixtures are consistent
  return true;
}

var validateTable = function(table) {
  if (!Array.isArray(table)) {
    return false;
  }
  for (var i=0; i<table.length; i++) {
    var elem = table[i];
    if (!elem.team || (typeof elem.team !== 'string')) {
      return false;
    }
    if (!elem.points || (typeof elem.points !== 'number')) {
      return false;
    }
  }
  return true;
};

var validateFixtures = function(fixtures) {
  if (!Array.isArray(fixtures)) {
    return false;
  }
  for (var i=0; i<fixtures.length; i++) {
    var fixture = fixtures[i];
    if (!fixture.homeTeam || typeof fixture.homeTeam != 'string') {
      return false;
    }
    if (!fixture.awayTeam || typeof fixture.awayTeam != 'string') {
      return false;
    }
  }
  return true;
};

var initOutput = function() {
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

// Main routine
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
