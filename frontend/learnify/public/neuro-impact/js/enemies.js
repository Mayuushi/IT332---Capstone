// Enemy classes

class Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        this.image = mainSprites;
        this.x = x;
        this.y = y;
        this.spriteSize = 150;
        this.hp = hp;
        this.score = this.hp;
        this.shoots = shoots;    // boolean; whether the enemy shoots back
        this.speedX = speedX;      // enemy speed x direction
        this.speedY = speedY;       // enemy speed y direction || angle speed for sin
        this.movement = movement;   // string: type of movement
        this.range = range;     // y axis range of enemy movement || 2nd break point on x axis for z movement
        this.xbreak = xbreak;   // x coordinate where the enemy starts z movement || the base on y for sinusoid
        this.delete = false;    // Enemy marked for Deletion
        this.angle = 0;
        this.spriteTimer = 0;     //sprite animation helper
        this.spriteInterval = Math.floor(Math.random() * 80) + 120;
        this.fireTimer = 0;       // projectile firing timer
        this.fireInteval = Math.floor(Math.random() * 2000) + 1000;   // projectile random firing interval b/w 1500 and 3500ms     
        this.hit = false;
    }
    update(deltaTime) {
        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;
            if (this.frameX - this.frameXStart >= this.maxFrames) this.frameX = this.frameXStart;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        // projectile generation
        if (this.shoots) {
            if (this.fireTimer > this.fireInteval) {
                currentLevel.enemyProjectiles.push(new Projectile(false, this));
                this.fireTimer = 0;
            }
            else this.fireTimer += deltaTime;
        }
        //movement
        switch (this.movement) {
            case "wave":
                this.x -= this.speedX;
                this.y = this.xbreak + this.range * Math.sin(this.angle);
                this.angle += this.speedY;
                break;

            case "zigzag":
                this.x -= this.speedX;
                if (this.x < this.xbreak && this.x >= this.range) this.y += this.speedY;
                break;

            case "mini1":    // mini boss 1 in level 3
                if (this.x > this.xbreak) this.x -= this.speedX;
                else {
                    if (this.y > 330 || this.y < 70) this.speedY *= -1;
                    this.y += this.speedY;
                }
                break;

            case "mini2":    // mini boss 2 in level 5
                if (this.x > this.xbreak) this.x -= this.speedX;
                else {
                    if (this.y > 430 || this.y < 150) this.speedY *= -1;
                    this.y += this.speedY;
                }
                break;

            case "linear":
            default:
                this.x -= this.speedX;
        }

        // garbage collection
        if (this.x + this.width < 0) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

class Meteor extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 100;
        this.height = 50;
        this.maxFrames = 2;
        this.frameXStart = 0;
        this.frameX = this.frameXStart;
        this.frameY = 1;
    }
}

class Triship extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 60;
        this.height = 70;
        this.maxFrames = 2;
        this.frameXStart = 2;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 1;
    }
}

class Squid extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 80;
        this.height = 50;
        this.maxFrames = 1;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 2;
    }
}

class Shuttle extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 90;
        this.height = 50;
        this.maxFrames = 1;
        this.frameXStart = 2;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 2;
    }
}

class Saucer extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 90;
        this.height = 50;
        this.maxFrames = 1;
        this.frameXStart = 4;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 2;
    }
}

class Tadpole extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 90;
        this.height = 50;
        this.maxFrames = 2;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 3;
    }
}

class Kraken extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 70;
        this.height = 80;
        this.maxFrames = 1;
        this.frameXStart = 4;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 3;
    }
}

class Marble1 extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 50;
        this.height = 50;
        this.maxFrames = 1;
        this.frameXStart = 0;
        this.frameX = this.frameXStart;
        this.frameY = 4;
    }
}

class Marble2 extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 50;
        this.height = 40;
        this.maxFrames = 1;
        this.frameXStart = 1;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 4;
    }
}

class Marble3 extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 50;
        this.height = 30;
        this.maxFrames = 1;
        this.frameXStart = 3;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 4;
    }
}

class Beetle extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 80;
        this.height = 50;
        this.maxFrames = 2;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 5;
    }
}

class Rock extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 70;
        this.height = 70;
        this.maxFrames = 1;
        this.frameXStart = 4;
        this.frameX = this.frameXStart;
        this.frameY = 5;
    }
}

class Flipper extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 60;
        this.height = 60;
        this.maxFrames = 2;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 6;
    }
}

class Dragonfly extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 100;
        this.height = 50;
        this.maxFrames = 2;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 7;
    }
}

class Torpedo {
    constructor(x, y, offsetX, offsetY) {
        this.image = mainSprites;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = 70;
        this.height = 50;
        this.x = x + offsetX;
        this.y = y + offsetY;
        this.delete = false;
        this.hp = 150;
        this.torpToggle = true;    // toggling torpedoes up and down
    }
    update(x) {
        if (this.hp <= 0) {
            this.x -= 7;
        } else {
            this.x = x + this.offsetX;
        }
        if (this.x + this.width < 0) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, 900, 300, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
