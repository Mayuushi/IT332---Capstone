// Canvas setup
const bgCanvas = document.getElementById("canvas-bg");
const mainCanvas = document.getElementById("canvas-main");
const bgCtx = bgCanvas.getContext("2d");
const mainCtx = mainCanvas.getContext("2d");

mainCanvas.width = 840;
mainCanvas.height = 480;
bgCanvas.width = 840;
bgCanvas.height = 480;

// Sprite images
const mainSprites = new Image();
mainSprites.src = "./img/gameSprites.png";
const bossSprites = new Image();
bossSprites.src = "./img/bossSprites.png";
const bgSprites1 = new Image();
bgSprites1.src = "./img/bgSprites1.png";
const bgSprites2 = new Image();
bgSprites2.src = "./img/bgSprites2.png";

// Background arrays
const bgArray2 = [0, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 1, 2, 0, 1, 1, 2];
const bgArray3 = [0, 1, 2, 2, 1, 0, 2, 0, 1, 2, 1, 0, 2, 0, 2, 1, 0, 1, 2, 0, 1];
const bgArray4 = [0, 1, 2, 2, 1, 0, 2, 0, 1, 2, 1, 0, 2, 0, 2, 1, 0, 1, 2, 2, 1, 0, 2, 0, 1, 0];
const bgArray5 = [0, 1, 2, 2, 0, 2, 1, 1, 0, 1, 0, 0, 1, 1, 2, 1, 0, 1, 2, 2, 0, 2, 1, 1, 0, 1, 0, 0];
const bgArray6 = [2, 2, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 2, 2, 1, 1, 0, 0, 1, 1];
const bgArray7 = [0, 0, 0];
const bgArray8 = [0];

// Keyboard state
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    s: { pressed: false },
    space: { pressed: false },
    x: { pressed: false }
};

// Game state variables
let gameOver = false;
let gamePause = false;
let isLevelDark = true;
let specialAtttack = "missile"; // "missile", "laser", "wall"
let specialCount = 3;
let lives = 4;
const maxLives = 7;
let playerScore = 0;
let playerHighScore = 0;
let isMainScreen = true;
let newGame = false;
