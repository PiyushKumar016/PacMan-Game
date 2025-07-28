import { SPEED, TILE_SIZE } from "./config.js";

export default class Pacman {
    constructor(x, y, images) {
        this.x = x;
        this.y = y;
        this.h = TILE_SIZE;
        this.w = TILE_SIZE;
        this.imagesArray = images;
        this.image = this.imagesArray[0];
        this.index = 0;
        this.delay = 0;
        this.currentDirection = null;
        this.nextDirection = null;
        this.lastDirection = 'right';
    }

    draw(context) {
        let angle = 0;
        if (this.lastDirection === "down") angle = Math.PI / 2;
        else if (this.lastDirection === "left") angle = Math.PI;
        else if (this.lastDirection === "up") angle = Math.PI * 1.5;

        context.save();
        context.translate(this.x + this.w / 2, this.y + this.h / 2);
        context.rotate(angle);
        context.drawImage(this.image, -this.w / 2, -this.h / 2, this.w, this.h);
        context.restore();
    }

    motion() {
        this.delay++;
        if (this.delay >= 3) {
            this.delay = 0;
            this.index++;
            if (this.index >= this.imagesArray.length) {
                this.index = 0;
            }
            this.image = this.imagesArray[this.index];
        }
    }

    updateMovement(mazeLayout) {
        this.motion();
        if (this.currentDirection !== null) {
            this.lastDirection = this.currentDirection;
        }

        const onGrid = this.x % TILE_SIZE === 0 && this.y % TILE_SIZE === 0;

        if (onGrid) {
            if (this.nextDirection) {
                if (this.canMove(this.nextDirection, mazeLayout)) {
                    this.currentDirection = this.nextDirection;
                    this.nextDirection = null;
                }
            }
            if (!this.canMove(this.currentDirection, mazeLayout)) {
                this.currentDirection = null;
            }
        }

        if (this.currentDirection === 'up') this.y -= SPEED;
        else if (this.currentDirection === 'down') this.y += SPEED;
        else if (this.currentDirection === 'left') this.x -= SPEED;
        else if (this.currentDirection === 'right') this.x += SPEED;
    }

    canMove(direction, mazeLayout) {
        if (!direction) return false;
        let nextTileX = this.x;
        let nextTileY = this.y;
        if (direction === "up") nextTileY -= TILE_SIZE;
        else if (direction === "down") nextTileY += TILE_SIZE;
        else if (direction === "left") nextTileX -= TILE_SIZE;
        else if (direction === "right") nextTileX += TILE_SIZE;
        return !this.isWall(nextTileX, nextTileY, mazeLayout);
    }

    isWall(x, y, mazeLayout) {
        if (!mazeLayout) return true;
        const gridX = Math.floor(x / TILE_SIZE);
        const gridY = Math.floor(y / TILE_SIZE);
        const numRows = mazeLayout.length;
        const numCols = mazeLayout[0].length;

        if (gridX < 0 || gridX >= numCols || gridY < 0 || gridY >= numRows) {
            return true;
        }
        return mazeLayout[gridY][gridX] === 1;
    }

    collectCoin(wall, coinsArray) {
        for (let i = coinsArray.length - 1; i >= 0; i--) {
            const coin = coinsArray[i];
            if (this.isCollidingFromCenter(coin)) {
                wall.mazeLayout[Math.floor(coin.y / TILE_SIZE)][Math.floor(coin.x / TILE_SIZE)] = 2;
                coinsArray.splice(i, 1);
                break;
            }
        }
    }

    isCollidingFromCenter(otherObject) {
        return (
            this.x < otherObject.x + otherObject.w &&
            this.x + this.w > otherObject.x &&
            this.y < otherObject.y + otherObject.h &&
            this.y + this.h > otherObject.y
        );
    }

    collectPower(wall, powerArray) {
        for (let i = powerArray.length - 1; i >= 0; i--) {
            const power = powerArray[i];
            if (this.isCollidingFromCenter(power)) {
                wall.mazeLayout[Math.floor(power.y / TILE_SIZE)][Math.floor(power.x / TILE_SIZE)] = 2;
                powerArray.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}