// Input handling for keyboard controls
class InputHandler {
    constructor(level) {
        this.level = level;
        // keyboard events
        window.addEventListener("keydown", (e) => {
            e.preventDefault();  //prevents the page scrolling
            if (gameOver || !level.active || gamePause) return;
            switch (e.key) {
                case "a":
                case "A":
                    keys.a.pressed = true;
                    break;
                case "d":
                case "D":
                    keys.d.pressed = true;
                    break;
                case "w":
                case "W":
                    keys.w.pressed = true;
                    break;
                case "s":
                case "S":
                    keys.s.pressed = true;
                    break;
                case " ":
                    if (!keys.space.pressed) {
                        this.level.playerProjectiles.push(new Projectile(true, this.level.player));
                        keys.space.pressed = true;
                    }
                    break;
                case "X":
                case "x":
                    if (!keys.x.pressed) {
                        if (specialCount > 0) {
                            switch (specialAtttack) {
                                case "missile": this.level.playerSpecial.push(new Missile(this.level));
                                    break;
                                case "laser": this.level.playerSpecial.push(new Laser(this.level));
                                    break;
                                case "wall": this.level.playerSpecial.push(new Wall(this.level));
                                    break;
                            }
                            specialCount--;
                        }
                        keys.x.pressed = true;
                    }
                    break;
            }
        });
        window.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "a":
                case "A":
                    keys.a.pressed = false;
                    break;
                case "d":
                case "D":
                    keys.d.pressed = false;
                    break;
                case "w":
                case "W":
                    keys.w.pressed = false;
                    break;
                case "s":
                case "S":
                    keys.s.pressed = false;
                    break;
                case " ":
                    keys.space.pressed = false;
                    break;
                case "X":
                case "x":
                    keys.x.pressed = false;
                    break;
            }
        });
    }
}
