const fs = require("fs");
const fetch = require("node-fetch");

const username = "NikhilRathod-1305";
const token = process.env.GH_TOKEN;

async function fetchContributions() {
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
  const cell = 14;
  const width = weeks.length;
  const height = 7;

  let svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${width * cell}"
     height="${height * cell}"
     viewBox="0 0 ${width * cell} ${height * cell}">
<style>
  .bg-light { fill:#ffffff; }
  .bg-dark { fill:#0d1117; }

  .empty-light { fill:#ebedf0; }
  .empty-dark { fill:#161b22; }

  .dot { fill:#2ea043; }

  .pacman {
    fill: yellow;
    animation: move ${width * 0.3}s linear infinite;
  }

  .mouth {
    fill: #0d1117;
    animation: chomp 0.4s infinite alternate;
  }

  @keyframes move {
    from { transform: translate(0px, ${cell * 3}px); }
    to { transform: translate(${width * cell}px, ${cell * 3}px); }
  }

  @keyframes chomp {
    from { transform: rotate(20deg); }
    to { transform: rotate(-20deg); }
  }

  @media (prefers-color-scheme: dark) {
    rect.bg { fill:#0d1117; }
    rect.empty { fill:#161b22; }
  }

  @media (prefers-color-scheme: light) {
    rect.bg { fill:#ffffff; }
    rect.empty { fill:#ebedf0; }
  }

</style>
`;

  svg += `<rect class="bg" width="100%" height="100%"/>`;

  weeks.forEach((week, x) => {
    week.contributionDays.forEach((day, y) => {
      const cls = day.contributionCount > 0 ? "dot" : "empty";
      svg += `<rect class="${cls}"
        x="${x * cell}"
        y="${y * cell}"
        width="${cell - 2}"
        height="${cell - 2}"
        rx="3"/>`;
    });
  });

  const pacmanY = cell * 3 + cell / 2;

  svg += `
<g class="pacman">
  <circle cx="10" cy="${pacmanY}" r="8"/>
  <polygon class="mouth"
           points="10,${pacmanY}
                   20,${pacmanY - 6}
                   20,${pacmanY + 6}"/>
</g>
`;

  svg += "</svg>";
  return svg;
}

(async () => {
  const weeks = await fetchContributions();
  const svg = generateSVG(weeks);
  fs.writeFileSync("pacman-contribution-graph.svg", svg);
})();
