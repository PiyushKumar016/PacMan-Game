
export default class Walls {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.h = 32;
        this.w = 32;
        this.image = new Image();
        this.image.src = "../assets/images/Wall.png";
        this.walls = [];
        this.mazeLayout = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 3, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
        this.createWallsFromLayout();
    }
    draw(context) {
        for (const wall of this.walls) {
            context.drawImage(this.image, wall.x, wall.y, this.w, this.h);
        }
    }
    createWallsFromLayout() {
        for (let y = 0; y < this.mazeLayout.length; y++) {
            for (let x = 0; x < this.mazeLayout[y].length; x++) {
                if (this.mazeLayout[y][x] === 1) {
                    this.walls.push({
                        x: x * this.w,
                        y: y * this.h,
                        h: this.h,
                        w:this.w
                    });
                }
            }
        }
    }

    
}