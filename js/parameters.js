const state = {
  currentScene: 1,
  selectedDecade: "All",
  hoveredPoint: null,
  data: [],
  filteredData: [],
  completedData: []
};

const SVG = {
  width: 900,
  height: 420,
  margin: { top: 40, right: 40, bottom: 60, left: 70 }
};

SVG.innerWidth = SVG.width - SVG.margin.left - SVG.margin.right;
SVG.innerHeight = SVG.height - SVG.margin.top - SVG.margin.bottom;

const tournamentSummaries = [
  { Year: 1930, Host: "Uruguay", Winner: "Uruguay", RunnerUp: "Argentina", GoalsScored: 70, Matches: 18, Teams: 13, Status: "Completed" },
  { Year: 1934, Host: "Italy", Winner: "Italy", RunnerUp: "Czechoslovakia", GoalsScored: 70, Matches: 17, Teams: 16, Status: "Completed" },
  { Year: 1938, Host: "France", Winner: "Italy", RunnerUp: "Hungary", GoalsScored: 84, Matches: 18, Teams: 15, Status: "Completed" },
  { Year: 1950, Host: "Brazil", Winner: "Uruguay", RunnerUp: "Brazil", GoalsScored: 88, Matches: 22, Teams: 13, Status: "Completed" },
  { Year: 1954, Host: "Switzerland", Winner: "West Germany", RunnerUp: "Hungary", GoalsScored: 140, Matches: 26, Teams: 16, Status: "Completed" },
  { Year: 1958, Host: "Sweden", Winner: "Brazil", RunnerUp: "Sweden", GoalsScored: 126, Matches: 35, Teams: 16, Status: "Completed" },
  { Year: 1962, Host: "Chile", Winner: "Brazil", RunnerUp: "Czechoslovakia", GoalsScored: 89, Matches: 32, Teams: 16, Status: "Completed" },
  { Year: 1966, Host: "England", Winner: "England", RunnerUp: "West Germany", GoalsScored: 89, Matches: 32, Teams: 16, Status: "Completed" },
  { Year: 1970, Host: "Mexico", Winner: "Brazil", RunnerUp: "Italy", GoalsScored: 95, Matches: 32, Teams: 16, Status: "Completed" },
  { Year: 1974, Host: "West Germany", Winner: "West Germany", RunnerUp: "Netherlands", GoalsScored: 97, Matches: 38, Teams: 16, Status: "Completed" },
  { Year: 1978, Host: "Argentina", Winner: "Argentina", RunnerUp: "Netherlands", GoalsScored: 102, Matches: 38, Teams: 16, Status: "Completed" },
  { Year: 1982, Host: "Spain", Winner: "Italy", RunnerUp: "West Germany", GoalsScored: 146, Matches: 52, Teams: 24, Status: "Completed" },
  { Year: 1986, Host: "Mexico", Winner: "Argentina", RunnerUp: "West Germany", GoalsScored: 132, Matches: 52, Teams: 24, Status: "Completed" },
  { Year: 1990, Host: "Italy", Winner: "West Germany", RunnerUp: "Argentina", GoalsScored: 115, Matches: 52, Teams: 24, Status: "Completed" },
  { Year: 1994, Host: "USA", Winner: "Brazil", RunnerUp: "Italy", GoalsScored: 141, Matches: 52, Teams: 24, Status: "Completed" },
  { Year: 1998, Host: "France", Winner: "France", RunnerUp: "Brazil", GoalsScored: 171, Matches: 64, Teams: 32, Status: "Completed" },
  { Year: 2002, Host: "South Korea/Japan", Winner: "Brazil", RunnerUp: "Germany", GoalsScored: 161, Matches: 64, Teams: 32, Status: "Completed" },
  { Year: 2006, Host: "Germany", Winner: "Italy", RunnerUp: "France", GoalsScored: 147, Matches: 64, Teams: 32, Status: "Completed" },
  { Year: 2010, Host: "South Africa", Winner: "Spain", RunnerUp: "Netherlands", GoalsScored: 145, Matches: 64, Teams: 32, Status: "Completed" },
  { Year: 2014, Host: "Brazil", Winner: "Germany", RunnerUp: "Argentina", GoalsScored: 171, Matches: 64, Teams: 32, Status: "Completed" },
  { Year: 2018, Host: "Russia", Winner: "France", RunnerUp: "Croatia", GoalsScored: 169, Matches: 64, Teams: 32, Status: "Completed" },
  { Year: 2022, Host: "Qatar", Winner: "Argentina", RunnerUp: "France", GoalsScored: 172, Matches: 64, Teams: 32, Status: "Completed" },
  { Year: 2026, Host: "Canada/Mexico/USA", Winner: "Spain", RunnerUp: "England", GoalsScored: 273, Matches: 104, Teams: 48, Status: "Completed" }
];

const countryAliases = {
  "West Germany": "Germany",
  "Germany": "Germany"
};

const countryColors = {
  Brazil: "#009C3B",
  Germany: "#1F1F1F",
  Italy: "#00A3E0",
  Argentina: "#74ACDF",
  France: "#5B2C83",
  Uruguay: "#5AAAA6",
  England: "#1E3A8A",
  Spain: "#FF6F00"
};

function normalizeCountry(country) {
  return countryAliases[country] || country;
}

function getCountryColor(country) {
  return countryColors[normalizeCountry(country)] || "#d4a017";
}

const decades = ["All", "1930s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

function getDecadeLabel(year) {
  const decadeStart = Math.floor(year / 10) * 10;
  return `${decadeStart}s`;
}

function isCompletedTournament(d) {
  return d.Status !== "Upcoming" && Number.isFinite(d.AvgGoalsPerGame) && Number.isFinite(d.GoalsScored);
}

function buildTournamentData(rawRows) {
  void rawRows;

  return tournamentSummaries
    .map((entry) => ({
      ...entry,
      Winner: normalizeCountry(entry.Winner),
      RunnerUp: normalizeCountry(entry.RunnerUp),
      AvgGoalsPerGame: Number.isFinite(entry.GoalsScored)
        ? +(entry.GoalsScored / entry.Matches).toFixed(2)
        : null
    }))
    .sort((a, b) => a.Year - b.Year);
}