export default class Coins {
    constructor(mazeLayout){
        this.h = 32;
        this.w = 32;
        this.image = new Image();
        this.image.src = "../assets/images/yellowDot.png";
        this.image2 = new Image();
        this.image2.src = "../assets/images/pinkDot.png";
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

    createCoins(layout){
        for(let y = 0; y < layout.length; y++) {
            for (let x = 0; x < layout[y].length; x++) {
                if (layout[y][x] === 0) {
                    this.coins.push({
                        x: x * this.w,
                        y: y * this.h,
                        h: this.h,
                        w: this.w
                    });
                }
                if (layout[y][x] === 3) {
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
