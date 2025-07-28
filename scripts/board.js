import Coins from './coins.js';
import { FRAME_RATE, GAME_HEIGHT, GAME_WIDTH, TILE_SIZE } from './config.js';
import Walls from './walls.js';
import Pacman from './pacman.js';
import ghosts from './ghosts.js';

window.addEventListener('load', init);
let context;
let walls;
let coins;
let pacMan;
let ghost1, ghost2, ghost3;
let lastUpdateTime = 0;
let ghostArr = [];
let animationFrameId;
let isBeatableGhost = false;
let won;
let assets = {};
function init() {
    loadSprites();
    keyBindings();
    prepareCanvas();
    gameLoop();
    loadAssets();
}

function keyBindings() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') pacMan.nextDirection = 'up';
        else if (e.key === 'ArrowDown') pacMan.nextDirection = 'down';
        else if (e.key === 'ArrowLeft') pacMan.nextDirection = 'left';
        else if (e.key === 'ArrowRight') pacMan.nextDirection = 'right';
    });
}

function loadAssets() {
    const assetList = [
        { name: 'wall', src: '../assets/images/wall.png' },
        { name: 'pacman0', src: '../assets/images/pac0.png' },
        { name: 'pacman1', src: '../assets/images/pac1.png' },
        { name: 'pacman2', src: '../assets/images/pac2.png' },
        { name: 'ghost', src: '../assets/images/ghost.png' },
        { name: 'coin', src: '../assets/images/yellowDot.png' },
        { name: 'power', src: '../assets/images/pinkDot.png' },
        { name: 'vulnerable_ghost', src: '../assets/images/vulnerable_ghost.png'}
    ];
    let loadedCount = 0;

    assetList.forEach(asset => {
        const img = new Image();
        img.src = asset.src;
        img.onload = () => {
            loadedCount++;
            assets[asset.name] = img;
            if (loadedCount === assetList.length) {
                initGame();
            }
        };
    });
}
function loadSprites() {
    won = document.getElementById('you_won');
    walls = new Walls();
    coins = new Coins(walls.mazeLayout);
    pacMan = new Pacman(TILE_SIZE * 1, TILE_SIZE * 1);

    ghost1 = new ghosts('../assets/images/ghost.png', TILE_SIZE * 16, TILE_SIZE * 1, TILE_SIZE, TILE_SIZE);
    ghost2 = new ghosts('../assets/images/ghost.png', TILE_SIZE * 1, TILE_SIZE * 11, TILE_SIZE, TILE_SIZE);
    ghost3 = new ghosts('../assets/images/ghost.png', TILE_SIZE * 16, TILE_SIZE * 11, TILE_SIZE, TILE_SIZE);
    ghostArr = [ghost1, ghost2, ghost3];
}

function prepareCanvas() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    canvas.style.border = '1px solid white';
    context = canvas.getContext('2d');
}

function checkGhostCollision() {
    for (let i = ghostArr.length - 1; i >= 0; i--) {
        const ghost = ghostArr[i];
        if (pacMan.isCollidingFromCenter(ghost)) {
            if (isBeatableGhost) {
                ghostArr.splice(i, 1);
            }
            else {
                const go = document.getElementById('game_over');
                go.style.display = 'flex'
                gameOver();
            }
        }
    }
}

function gameOver() {
    console.log("Game Over");
    cancelAnimationFrame(animationFrameId);
}

function gameLoop(currentTime) {
    animationFrameId = requestAnimationFrame(gameLoop);

    const deltaTime = currentTime - lastUpdateTime;
    const interval = 4000 / FRAME_RATE;

    if (deltaTime > interval) {
        pacMan.updateMovement(walls.mazeLayout);
        pacMan.collectCoin(walls, coins.coins, won);
        if (pacMan.collectPower(walls, coins.powers) && !isBeatableGhost) {
            isBeatableGhost = true;
            ghostArr.forEach(ghost => {
                ghost.image.src = '../assets/images/scaredGhost.png';
            });
            setTimeout(() => {
                isBeatableGhost = false;
                ghostArr.forEach(ghost => {
                    ghost.image.src = '../assets/images/ghost.png';
                });
            }, 5000);
        }

        checkGhostCollision();
        ghostArr.forEach(ghost => ghost.updateMovement(walls.mazeLayout));
        lastUpdateTime = currentTime - (deltaTime % interval);
        
    }
    if (coins.coins.length == 0) {
        won.style.display = 'flex';
        cancelAnimationFrame(animationFrameId);
    }
    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    walls.draw(context);
    coins.draw(context);
    pacMan.draw(context);
    ghostArr.forEach(ghost => ghost.draw(context));
}