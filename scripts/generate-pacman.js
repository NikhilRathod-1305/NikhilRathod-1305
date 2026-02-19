const fs = require("fs");
const fetch = require("node-fetch");

const username = "NikhilRathod-1305";
const token = process.env.GH_TOKEN;

async function getContributions() {
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  const json = await response.json();
  return json.data.user.contributionsCollection.contributionCalendar.weeks;
}

function generateSVG(weeks) {
  const cellSize = 14;
  const width = weeks.length;
  const height = 7;

  let svg = `
  <svg xmlns="http://www.w3.org/2000/svg"
       width="${width * cellSize}"
       height="${height * cellSize}"
       style="background:#0d1117">
  <style>
    .dot { fill:#2ea043; }
    .empty { fill:#161b22; }
    .pacman {
      fill:yellow;
      animation: move 15s linear infinite;
    }
    @keyframes move {
      from { transform: translate(0px,0px); }
      to { transform: translate(${width * cellSize}px,0px); }
    }
  </style>
  `;

  weeks.forEach((week, x) => {
    week.contributionDays.forEach((day, y) => {
      const color = day.contributionCount > 0 ? "dot" : "empty";
      svg += `<rect class="${color}"
              x="${x * cellSize}"
              y="${y * cellSize}"
              width="${cellSize - 2}"
              height="${cellSize - 2}"
              rx="3"/>`;
    });
  });

  svg += `<circle class="pacman" cx="10" cy="50" r="8"/>`;
  svg += "</svg>";

  return svg;
}

(async () => {
  const weeks = await getContributions();
  const svg = generateSVG(weeks);
  fs.writeFileSync("pacman-contribution-graph.svg", svg);
})();
