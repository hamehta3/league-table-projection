var express = require('express');
var router = express.Router();
var TableController = require('../controllers/table-controller.js');
var mocks = require('../public/data/la-liga-mocks.js');

var errorNotSupported = { error: 'Content Type not supported' };
var errorInternal = { error: 'An internal error occurred' };

var table = mocks('table');
var fixtures = mocks('fixtures');

var ctrl = new TableController(table, fixtures);  // load default mock data

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
  res.send(ctrl.table.sort(ctrl.tieBreaker));
});

router.post('/table', function(req, res) {
  if (!req.body || !ctrl.validateTable(req.body)) {
    res.send(errorInternal);
  } else {
    ctrl.table = req.body;
    res.send(ctrl.table);
  }
});

router.get('/fixtures', function(req, res) {
  res.send(ctrl.fixtures);
});

router.post('/fixtures', function(req, res) {
  if (!req.body || !ctrl.validateFixtures(req.body)) {
    res.send(errorInternal);
  } else {
    ctrl.fixtures = req.body;
    res.send(ctrl.fixtures);
  }
});

router.get('/table/project', function(req, res) {
  ctrl.validate();
  ctrl.initOutput();
  try {
    ctrl.project(0);
    res.send(ctrl.output);
  } catch(e) {
    console.error(e);
    res.send(errorInternal);
  }
});

// TODO add support to read data for different leagues

module.exports = router;
