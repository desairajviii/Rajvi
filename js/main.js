const court = document.querySelector("#court");
const hoopX = 250;
const hoopY = 150;

let totalShots = 0;
let totalMakes = 0;

const statShots = document.querySelector("#statShots");
const statMakes = document.querySelector("#statMakes");
const statPercent = document.querySelector("#statPercent");

court.addEventListener("click", (event) => {
  const point = getClickPosition(event);
  const distance = getDistanceFromHoop(point);
  const isMake = decideIfMake(distance);

  drawShotMarker(point, isMake);
  updateStats(isMake);
});

function getClickPosition(event) {
  const rect = court.getBoundingClientRect();

  // Convert the click from screen pixels into the SVG's own
  // 500x470 coordinate space, since the court is scaled to fit
  // whatever width the browser gives it.
  const scaleX = 500 / rect.width;
  const scaleY = 470 / rect.height;

  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  return { x, y };
}

function getDistanceFromHoop(point) {
  const dx = point.x - hoopX;
  const dy = point.y - hoopY;
  return Math.sqrt(dx * dx + dy * dy);
}

function decideIfMake(distance) {
  // Closer shots have a higher chance of going in.
  // Right under the rim: ~90% chance. Near the three-point line: ~25%.
  let makeChance;

  if (distance < 50) {
    makeChance = 0.9;
  } else if (distance < 150) {
    makeChance = 0.6;
  } else if (distance < 250) {
    makeChance = 0.4;
  } else {
    makeChance = 0.25;
  }

  return Math.random() < makeChance;
}

function drawShotMarker(point, isMake) {
  const marker = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  marker.setAttribute("cx", point.x);
  marker.setAttribute("cy", point.y);
  marker.setAttribute("r", 6);
  marker.setAttribute("fill", isMake ? "#2ecc71" : "#e74c3c");
  marker.setAttribute("class", "shot-mark");
  court.appendChild(marker);
}

function updateStats(isMake) {
  totalShots += 1;
  if (isMake) {
    totalMakes += 1;
  }

  const percent = Math.round((totalMakes / totalShots) * 100);

  statShots.textContent = totalShots;
  statMakes.textContent = totalMakes;
  statPercent.textContent = `${percent}%`;
}
