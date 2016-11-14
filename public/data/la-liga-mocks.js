const mocks = {
  table: [
    {
      team: "Real Madrid",
      points: 27
    },
    {
      team: "Barcelona",
      points: 25
    },
    {
      team: "Villarreal",
      points: 22
    },
    {
      team: "Atletico Madrid",
      points: 21
    },
    {
      team: "Sevilla",
      points: 21
    },
    {
      team: "Real Sociedad",
      points: 19
    },
    {
      team: "Athletic Bilbao",
      points: 17
    },
    {
      team: "Celta Vigo",
      points: 17
    },
    {
      team: "Las Palmas",
      points: 16
    },
    {
      team: "Malaga",
      points: 15
    },
    {
      team: "Eibar",
      points: 15
    },
    {
      team: "Alaves",
      points: 13
    },
    {
      team: "Espanyol",
      points: 12
    },
    {
      team: "Real Betis",
      points: 11
    },
    {
      team: "Valencia",
      points: 10
    },
    {
      team: "Deportivo La Coruna",
      points: 10
    },
    {
      team: "Leganes",
      points: 10
    },
    {
      team: "Sporting Gijon",
      points: 9
    },
    {
      team: "Osasuna",
      points: 7
    },
    {
      team: "Granada",
      points: 4
    }
  ],

  fixtures: [
    {
      homeTeam: "Real Betis",
      awayTeam: "Las Palmas"
    },
    {
      homeTeam: "Deportivo La Coruna",
      awayTeam: "Sevilla"
    },
    {
      homeTeam: "Barcelona",
      awayTeam: "Malaga"
    },
    {
      homeTeam: "Eibar",
      awayTeam: "Celta Vigo"
    },
    {
      homeTeam: "Atletico Madrid",
      awayTeam: "Real Madrid"
    },
    {
      homeTeam: "Alaves",
      awayTeam: "Espanyol"
    },
    {
      homeTeam: "Valencia",
      awayTeam: "Granada"
    },
    {
      homeTeam: "Sporting Gijon",
      awayTeam: "Real Sociedad"
    },
    {
      homeTeam: "Athletic Bilbao",
      awayTeam: "Villarreal"
    },
    {
      homeTeam: "Leganes",
      awayTeam: "Osasuna"
    }
  ]

}

module.exports = function get(objName) {
  return JSON.parse(JSON.stringify(mocks[objName]));
};

