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
let wonScreen, gameOverScreen;
let assets;

async function init() {
    wonScreen = document.getElementById('you_won');
    gameOverScreen = document.getElementById('game_over');
    assets = await loadAssets();
    if (assets) {
        loadSprites(assets);
        keyBindings();
        prepareCanvas();
        gameLoop();
    }
}

function keyBindings() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') pacMan.nextDirection = 'up';
        else if (e.key === 'ArrowDown') pacMan.nextDirection = 'down';
        else if (e.key === 'ArrowLeft') pacMan.nextDirection = 'left';
        else if (e.key === 'ArrowRight') pacMan.nextDirection = 'right';
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function loadAssets() {
    const assetList = [
        { name: 'wall', src: './assets/images/wall.png' },
        { name: 'pacman0', src: './assets/images/pac0.png' },
        { name: 'pacman1', src: './assets/images/pac1.png' },
        { name: 'pacman2', src: './assets/images/pac2.png' },
        { name: 'ghost', src: './assets/images/ghost.png' },
        { name: 'vulnerable_ghost', src: './assets/images/scaredGhost.png' },
        { name: 'coin', src: './assets/images/yellowDot.png' },
        { name: 'power', src: './assets/images/pinkDot.png' }
    ];
    const loadedAssets = {};
    try {
        const promises = assetList.map(asset => loadImage(asset.src));
        const loadedImages = await Promise.all(promises);
        assetList.forEach((asset, i) => {
            loadedAssets[asset.name] = loadedImages[i];
        });
        return loadedAssets;
    }
    catch (error) {
        console.error("Failed to load assets:", error);
        return null;
    }
}

function loadSprites(assets) {
    walls = new Walls(assets.wall);
    coins = new Coins(walls.mazeLayout, assets.coin, assets.power);

    const pacmanImages = [assets.pacman0, assets.pacman1, assets.pacman2];
    pacMan = new Pacman(TILE_SIZE * 1, TILE_SIZE * 1, pacmanImages);

    ghost1 = new ghosts(assets.ghost, TILE_SIZE * 16, TILE_SIZE * 1, TILE_SIZE, TILE_SIZE);
    ghost2 = new ghosts(assets.ghost, TILE_SIZE * 1, TILE_SIZE * 11, TILE_SIZE, TILE_SIZE);
    ghost3 = new ghosts(assets.ghost, TILE_SIZE * 16, TILE_SIZE * 11, TILE_SIZE, TILE_SIZE);
    ghostArr = [ghost1, ghost2, ghost3];
}

function prepareCanvas() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    context = canvas.getContext('2d');
}

function checkGhostCollision() {
    for (let i = ghostArr.length - 1; i >= 0; i--) {
        const ghost = ghostArr[i];
        if (pacMan.isCollidingFromCenter(ghost)) {
            if(isBeatableGhost) {
                ghostArr.splice(i, 1);
            } 
            else{
                gameOver();
            }
        }
    }
}

function gameOver() {
    gameOverScreen.style.display = 'flex';
    cancelAnimationFrame(animationFrameId);
}

function gameLoop(currentTime) {
    animationFrameId = requestAnimationFrame(gameLoop);
    const deltaTime = currentTime - lastUpdateTime;
    const interval = 4000 / FRAME_RATE;

    if(deltaTime > interval) {
        pacMan.updateMovement(walls.mazeLayout);
        pacMan.collectCoin(walls, coins.coins);
        if(pacMan.collectPower(walls, coins.powers) && !isBeatableGhost) {
            isBeatableGhost = true;
            ghostArr.forEach(ghost => {
                ghost.image = assets.vulnerable_ghost;
            });
            setTimeout(() => {
                isBeatableGhost = false;
                ghostArr.forEach(ghost => {
                    ghost.image = assets.ghost;
                });
            }, 5000);
        }

        if(coins.coins.length === 0) {
            wonScreen.style.display = 'flex';
            cancelAnimationFrame(animationFrameId);
            return;
        }

        checkGhostCollision();
        ghostArr.forEach(ghost => ghost.updateMovement(walls.mazeLayout));
        lastUpdateTime = currentTime - (deltaTime % interval);
    }

    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    walls.draw(context);
    coins.draw(context);
    pacMan.draw(context);
    ghostArr.forEach(ghost => ghost.draw(context));
}