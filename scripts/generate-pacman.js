const fs = require("fs");

const width = 52;
const height = 7;
const cellSize = 16;

let svg = `
<svg width="${width * cellSize}" height="${height * cellSize}" 
xmlns="http://www.w3.org/2000/svg" style="background:#0d1117">
<style>
  .dot { fill:#2ea043; }
  .wall { fill:#30363d; }
  .pacman {
    fill:yellow;
    animation: chomp 0.6s infinite;
  }
  @keyframes chomp {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(20deg); }
    100% { transform: rotate(0deg); }
  }
</style>
`;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    svg += `<rect class="wall" x="${x * cellSize}" y="${y * cellSize}" width="${cellSize-2}" height="${cellSize-2}" rx="3"/>`;
  }
}

// Pacman
svg += `<circle class="pacman" cx="40" cy="40" r="10"/>`;

svg += "</svg>";

fs.writeFileSync("pacman-contribution-graph.svg", svg);
