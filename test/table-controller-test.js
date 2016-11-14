var assert = require('assert');
var mocks = require('../public/data/mocks.js');

var ctrl;
var table, fixtures;

beforeEach(function() {
  Controller = require('../controllers/table-controller.js');
  // Mock data
  table = mocks('table');
  fixtures = mocks('fixtures');
  ctrl = new Controller(table, fixtures);  // inject mock data
});

describe('Table Controller', function() {
  describe('Check match outcomes', function() {
    it('should assign 3 points for home win and 0 for losing team', function() {
      assert.deepEqual(ctrl.outcomes[0], [3, 0]);
    });

    it('should give 1 point each in case of a draw', function() {
      assert.deepEqual(ctrl.outcomes[1], [1, 1]);
    });

    it('should assign 0 points for home loss and 3 for away winner', function() {
      assert.deepEqual(ctrl.outcomes[2], [0, 3]);
    });
  });

  describe('Validate data', function() {
    it('should accept valid table', function() {
      assert.equal(ctrl.validateTable(table), true);
    });

    it('should not accept table with a missing team field', function() {
      delete table[1].team;
      assert.equal(ctrl.validateTable(table), false);
    });

    it('should not accept table with a missing points field', function() {
      delete table[4].points;
      assert.equal(ctrl.validateTable(table), false);
    });

    it('should not accept table with a invalid points format', function() {
      table[4].points = 'abc';
      assert.equal(ctrl.validateTable(table), false);
    });

    it('should accept valid fixture list', function() {
      assert.equal(ctrl.validateFixtures(fixtures), true);
    });

    it('should not accept fixture list with a missing home team', function() {
      delete fixtures[1].homeTeam;
      assert.equal(ctrl.validateFixtures(fixtures), false);
    });

    it('should not accept fixture list with a missing away team', function() {
      delete fixtures[2].awayTeam;
      assert.equal(ctrl.validateFixtures(fixtures), false);
    });
  });

  describe('Run main algorithm', function() {
    it('should ensure projections are correct', function() {
      ctrl.validate();
      ctrl.initOutput();
      ctrl.project(0);
      assert.equal(ctrl.output[0].highestPos, 1);
      assert.equal(ctrl.output[0].lowestPos, 3);
      assert.equal(ctrl.output[3].highestPos, 3);
      assert.equal(ctrl.output[3].lowestPos, 7);
      assert.equal(ctrl.output[7].highestPos, 5);
      assert.equal(ctrl.output[7].lowestPos, 9);
    });
  });
});