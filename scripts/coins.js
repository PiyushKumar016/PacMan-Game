import { TILE_SIZE } from "./config.js";

export default class Coins {
    constructor(mazeLayout, coinImage, powerImage) {
        this.h = TILE_SIZE;
        this.w = TILE_SIZE;
        this.image = coinImage;
        this.image2 = powerImage;
        this.coins = [];
        this.powers = [];
        this.createCoins(mazeLayout);
    }

    draw(context) {
        for (const coin of this.coins) {
            context.drawImage(this.image, coin.x, coin.y, this.w, this.h);
        }
        for (const power of this.powers) {
            context.drawImage(this.image2, power.x, power.y, this.w, this.h);
        }
    }

    createCoins(layout) {
        for (let y = 0; y < layout.length; y++) {
            for (let x = 0; x < layout[y].length; x++) {
                if (layout[y][x] === 0) {
                    this.coins.push({
                        x: x * this.w,
                        y: y * this.h,
                        h: this.h,
                        w: this.w
                    });
                } 
                else if (layout[y][x] === 3) {
                    this.powers.push({
                        x: x * this.w,
                        y: y * this.h,
                        h: this.h,
                        w: this.w
                    });
                }
            }
        }
    }
}