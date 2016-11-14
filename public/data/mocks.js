const mocks = {
  table: [
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
  ],

  fixtures: [
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
  ]

};

module.exports = function get(objName) {
  return JSON.parse(JSON.stringify(mocks[objName]));
};