// Main game initialization and loop

// ── High Score API ──────────────────────────────────────────────────────────
const HIGHSCORE_API = "https://it332-capstone.onrender.com/api/neuro-impact/highscore";

// Read the logged-in user from localStorage (set by the React app on login)
let currentUserId = null;
try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        currentUserId = parsedUser.id || null;
    }
} catch (e) {
    console.warn("Could not read user from localStorage", e);
}

async function loadHighScore() {
    if (!currentUserId) return;
    try {
        const res = await fetch(`${HIGHSCORE_API}/${currentUserId}`);
        if (res.status === 204) return; // no score yet
        if (res.ok) {
            const data = await res.json();
            playerHighScore = data.score || 0;
        }
    } catch (e) {
        console.warn("Could not load high score", e);
    }
}

let scoreSubmitted = false;
async function submitHighScore(score) {
    if (!currentUserId || scoreSubmitted) return;
    scoreSubmitted = true;
    try {
        const res = await fetch(HIGHSCORE_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: currentUserId, score })
        });
        if (res.ok) {
            const data = await res.json();
            playerHighScore = data.score || playerHighScore;
        }
    } catch (e) {
        console.warn("Could not submit high score", e);
    }
}
// ─────────────────────────────────────────────────────────────────────────────

// Initialize current level
let currentLevel = new Level(1, true);
let lastTime = 0;    // previous time stamp

// Load high score for the current user
loadHighScore();

// DOM elements
const logo = document.getElementById("logo");
const playButton = document.getElementById("play");
const exitButton = document.getElementById("exit");
const pauseButton = document.getElementById("pause-button");
const instructionsScreen = document.getElementById("instructions-screen");
const startGameButton = document.getElementById("start-game-button");
const gameDiv = document.getElementById("game");

// Hide game initially and show instructions
gameDiv.style.display = "none";

// Game state functions
function nextLevel(num, isDark) {
    currentLevel = new Level(num, isDark);
}

function gameWin() {
    submitHighScore(playerScore);
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    particles.forEach(particle => particle.update());

    mainCtx.save();
    mainCtx.font = "bold 60px Silkscreen";
    bgCanvas.style.background = "#282828";
    mainCtx.textAlign = "center";
    mainCtx.fillStyle = "#aad69c";
    mainCtx.fillText("You Win!", 420, 120);
    mainCtx.fillText("Score: " + playerScore.toString().padStart(5, "0"), 420, 210);
    mainCtx.font = "bold 36px Silkscreen";
    mainCtx.fillText("Best: " + playerHighScore.toString().padStart(5, "0"), 420, 280);
    if (playerScore >= playerHighScore && playerScore > 0) {
        mainCtx.fillStyle = "#ffd700";
        mainCtx.fillText("New High Score!", 420, 340);
    }
    mainCtx.restore();
    exitButton.style.display = "block";
    pauseButton.style.visibility = "hidden";
}

function gameLose() {
    submitHighScore(playerScore);
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    particles.forEach(particle => particle.update());

    mainCtx.save();
    bgCanvas.style.background = "#282828";
    mainCtx.fillStyle = "#aad69c";
    mainCtx.font = "bold 60px Silkscreen";
    mainCtx.textAlign = "center";
    mainCtx.fillText("Game Over!", 420, 100);
    mainCtx.fillText("Score: " + playerScore.toString().padStart(5, "0"), 420, 195);
    mainCtx.font = "bold 36px Silkscreen";
    mainCtx.fillText("Best: " + playerHighScore.toString().padStart(5, "0"), 420, 260);
    if (playerScore >= playerHighScore && playerScore > 0) {
        mainCtx.fillStyle = "#ffd700";
        mainCtx.fillText("New High Score!", 420, 320);
    } else {
        mainCtx.font = "bold 40px Silkscreen";
        mainCtx.fillStyle = "#aad69c";
        mainCtx.fillText("Better Luck Next Time", 420, 340);
    }
    mainCtx.restore();
    exitButton.style.display = "block";
    pauseButton.style.visibility = "hidden";
}

function gameStart() {
    playButton.style.display = "none";
    pauseButton.style.visibility = "visible";
    isMainScreen = false;
}

function mainScreen() {
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    particles.forEach(particle => particle.update());
    bgCanvas.style.background = "#282828";
    mainCtx.drawImage(logo, 0, 0, 1190, 430, 100, 100, 640, 245);
}

// Animation loop
function animate(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (isMainScreen) mainScreen();
    else if (!gamePause && !gameOver) {
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        currentLevel.update(deltaTime);
    }
    else {
        mainCtx.save();
        mainCtx.fillStyle = "red";
        mainCtx.textAlign = "center";
        mainCtx.font = "bold 60px Silkscreen"
        mainCtx.fillText("|| Game Paused", 420, 260);
        mainCtx.restore();
    }
    if (gameOver) {
        lives > 0 ? gameWin() : gameLose();
    }

    requestAnimationFrame(animate);
}
animate(0);

// Event listeners
exitButton.addEventListener("click", () => {
    scoreSubmitted = false; // allow submitting on the next game
    document.location.reload();   // !!! reloading this because game not loading properly second time, tried everything, still unknown bug
});

pauseButton.addEventListener("click", () => {
    gamePause = !gamePause;
    if (gamePause) pauseButton.innerHTML = "Resume";
    else pauseButton.innerHTML = "Pause";
    pauseButton.blur();
});

playButton.addEventListener("click", gameStart);
exitButton.addEventListener("click", gameStart);

// Start game button from instructions screen
startGameButton.addEventListener("click", () => {
    instructionsScreen.style.display = "none";
    gameDiv.style.display = "block";
    // Position buttons after game div is displayed
    playButton.style.top = `${bgCanvas.getBoundingClientRect().height - 70}px`;
    exitButton.style.top = `${bgCanvas.getBoundingClientRect().height - 70}px`;
});

window.addEventListener("resize", ()=>{
    if (gameDiv.style.display !== "none") {
        playButton.style.top = `${bgCanvas.getBoundingClientRect().height - 70}px`;
        exitButton.style.top = `${bgCanvas.getBoundingClientRect().height - 70}px`;
    }
})
