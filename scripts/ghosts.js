import getRandomNumber from './random.js';
import { SPEED, TILE_SIZE } from "./config.js";

export default class ghosts {
    constructor(imageUrl, x, y, h, w) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.image = new Image();
        this.image.src = imageUrl;
        this.currentDirection = null;
        this.nextDirection = null;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.w, this.h);
    }

    getValidMoves(mazeLayout) {
        const moves = [];
        if (this.canMove("up", mazeLayout)) moves.push("up");
        if (this.canMove("down", mazeLayout)) moves.push("down");
        if (this.canMove("left", mazeLayout)) moves.push("left");
        if (this.canMove("right", mazeLayout)) moves.push("right");
        return moves;
    }

    updateMovement(mazeLayout) {
    const onGrid = this.x % TILE_SIZE === 0 && this.y % TILE_SIZE === 0;

    if (onGrid) {
        if (!this.canMove(this.currentDirection, mazeLayout)) {
            const validMoves = this.getValidMoves(mazeLayout);

            if (validMoves.length > 0) {
                const randomIndex = Math.floor(Math.random() * validMoves.length);
                this.nextDirection = validMoves[randomIndex];
            }
        }

        if (this.nextDirection) {
            this.currentDirection = this.nextDirection;
            this.nextDirection = null;
        }
    }

    if (this.currentDirection === 'up') {
        this.y -= SPEED;
    } 
    else if (this.currentDirection === 'down') {
        this.y += SPEED;
    } 
    else if (this.currentDirection === 'left') {
        this.x -= SPEED;
    } 
    else if (this.currentDirection === 'right') {
        this.x += SPEED;
    }
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
}