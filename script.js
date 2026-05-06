const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== ASSETS =====
const assets = {
  player: "https://i.postimg.cc/q7TqvPmL/Chat-GPT-Image-15-apr-2026-g-16-26-06.png",
  enemy: "https://i.imgur.com/8v5kL2p.png",
  tree: "https://i.postimg.cc/XNRpPBwk/Chat-GPT-Image-19-apr-2026-g-18-14-51.png",
  wall: "https://i.postimg.cc/qvYYc0f2/Chat-GPT-Image-19-apr-2026-g-18-17-34.png",
  floor: "https://i.postimg.cc/wBXVtd99/Chat-GPT-Image-19-apr-2026-g-18-19-14.png",
  ramp: "https://i.postimg.cc/zG9tbjWv/Chat-GPT-Image-19-apr-2026-g-18-18-17.png",
  cone: "https://i.postimg.cc/L8Zvp17s/Chat-GPT-Image-19-apr-2026-g-18-18-48.png"
};

const images = {};
for (let key in assets) {
  images[key] = new Image();
  images[key].src = assets[key];
}

// ===== GAME =====
let wood = 0;
let hp = 100;
let buildMode = "wall";

const player = { x: 800, y: 600, size: 40, speed: 4 };

const enemies = Array.from({ length: 50 }, () => ({
  x: Math.random() * 3000,
  y: Math.random() * 3000,
  size: 38,
  hp: 80
}));

const trees = Array.from({ length: 40 }, () => ({
  x: Math.random() * 3000,
  y: Math.random() * 3000,
  size: 50,
  hp: 60
}));

const builds = [];
const keys = {};

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

document.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") return;
  action();
});

function setBuild(type) {
  buildMode = type;
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ===== COLLISION =====
function isColliding(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

// ===== ACTION =====
function action() {
  let acted = false;

  for (let t of trees) {
    if (t.hp > 0 && dist(player, t) < 80) {
      t.hp -= 20;
      wood++;
      updateUI();
      acted = true;
      break;
    }
  }

  if (!acted) {
    for (let e of enemies) {
      if (e.hp > 0 && dist(player, e) < 75) {
        e.hp -= 28;
        acted = true;
        break;
      }
    }
  }

  if (!acted && wood > 0) {
    builds.push({
      x: player.x,
      y: player.y,
      size: 48,
      type: buildMode,
      hp: 100
    });
    wood--;
    updateUI();
  }
}

// ===== PLAYER =====
function updatePlayer() {
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;
}

// ===== ENEMIES =====
function updateEnemies() {
  enemies.forEach(e => {
    if (e.hp <= 0) return;

    let blocked = false;

    for (let b of builds) {
      const enemyBox = {
        x: e.x - e.size/2,
        y: e.y - e.size/2,
        size: e.size
      };

      const buildBox = {
        x: b.x - b.size/2,
        y: b.y - b.size/2,
        size: b.size
      };

      if (isColliding(enemyBox, buildBox)) {
        b.hp -= 0.5;
        blocked = true;

        if (b.hp <= 0) {
          builds.splice(builds.indexOf(b), 1);
        }
        break;
      }
    }

    if (blocked) return;

    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const d = Math.hypot(dx, dy);

    if (d < 250) {
      e.x += (dx / d) * 1.8;
      e.y += (dy / d) * 1.8;
    }

    if (d < 40) {
      hp -= 0.3;
      updateUI();
    }
  });
}

// ===== UI =====
function updateUI() {
  document.getElementById("wood").innerText = wood;
  document.getElementById("hp").innerText = Math.floor(hp);
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = player.x - canvas.width / 2;
  const cy = player.y - canvas.height / 2;

  trees.forEach(t => {
    if (t.hp > 0) {
      ctx.drawImage(images.tree, t.x - cx - 25, t.y - cy - 25, 50, 50);
    }
  });

  builds.forEach(b => {
    ctx.drawImage(images[b.type], b.x - cx - 24, b.y - cy - 24, 48, 48);

    // HP bar
    ctx.fillStyle = "red";
    ctx.fillRect(
      b.x - cx - 24,
      b.y - cy - 30,
      48 * (b.hp / 100),
      4
    );
  });

  enemies.forEach(e => {
    if (e.hp > 0) {
      ctx.drawImage(images.enemy, e.x - cx - 19, e.y - cy - 19, 38, 38);
    }
  });

  ctx.drawImage(images.player, player.x - cx - 20, player.y - cy - 20, 40, 40);
}

// ===== LOOP =====
function loop() {
  updatePlayer();
  updateEnemies();
  draw();
  requestAnimationFrame(loop);
}
loop();

// ===== MUSIC =====
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

document.addEventListener("click", () => {
  music.play(
}, { once: true });

musicBtn.onclick = () => {
  if (music.paused) {
    music.play();
    musicBtn.textContent = "🔊 Music: ON";
  } else {
    music.pause();
    musicBtn.textContent = "🔇 Music: OFF";
  }
};

music.volume = 0.4;
