// Projectile classes

// Basic projectile for player and enemies
class Projectile {
    constructor(isPlayer, object) {
        this.object = object;
        this.isPlayer = isPlayer;  //boolean to differentiate enemy and player
        this.width = 20;
        this.height = 10;
        if (isPlayer) {
            this.x = this.object.x + this.object.width;
            this.y = this.object.y + this.object.height * 0.5 - this.height * 0.5;
            this.speed = 3;
        } else {
            this.x = this.object.x;
            this.y = this.object.y + this.object.height * 0.5 - this.height * 0.5;
            this.speed = -object.speedX - 1;
        }
        this.delete = false;
    }
    update() {
        this.x += this.speed;
        if (this.x >= mainCanvas.width || this.x < 0) this.delete = true;
        this.draw();
    }
    draw() {
        mainCtx.fillStyle = "#282828";
        if (isLevelDark) mainCtx.fillStyle = "#c50633";
        mainCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Power-up items
class PowerUp {
    constructor(x, y, speedX, speedY, movement, range, xbreak) {
        this.image = mainSprites;
        this.isPowerUp = true;
        this.width = 80;
        this.height = 70;
        this.x = x;
        this.y = y;
        this.spriteSize = 150;
        this.maxFrames = 2;
        this.frameXStart = 4;
        this.frameY = 6;
        if (isLevelDark) this.frameY = 7;
        this.frameX = this.frameXStart;
        this.delete = false;      // powerUp marked for deletion;
        this.speedX = speedX;
        this.speedY = speedY;
        this.movement = movement;
        this.range = range;
        this.xbreak = xbreak;
        this.angle = 0;
        this.spriteTimer = 0;     //sprite animation helper
        this.spriteInterval = 300;
        this.hit = false;  // flag for single collision else multiple power added

        //randomizing the power up awarded to the player
        this.randomize = Math.random();
        if (this.randomize < 0.25) this.powerup = "life";
        else if (this.randomize < 0.5) this.powerup = "missile";
        else if (this.randomize < 0.75) this.powerup = "laser";
        else this.powerup = "wall";
    }
    update(deltaTime) {
        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;
            if (this.frameX - this.frameXStart >= this.maxFrames) this.frameX = this.frameXStart;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        //movement
        switch (this.movement) {
            case "wave":
                this.x -= this.speedX;
                this.y = this.xbreak + this.range * Math.sin(this.angle);
                this.angle += this.speedY;
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

// Missile special attack
class Missile {
    constructor(level) {
        this.image = mainSprites;
        this.spriteX = 900;
        this.spriteY = 0;
        if (isLevelDark) this.spriteY = 150;
        this.level = level;
        this.width = 50;
        this.height = 30;
        this.x = this.level.player.x + this.level.player.width;
        this.y = this.level.player.y + this.level.player.height * 0.5 - this.height * 0.5;
        this.targetSet = false;
        this.target = null;
        this.speedX = 3;
        this.speedY = 0;
        this.delete = false;
        this.damage = 50;
        this.specialType = "missile";
        this.hit = false;
    }
    update() {
        // setting the target
        if (!this.targetSet) {
            this.level.enemies.forEach(enemy => {
                if (enemy.x > this.x + 40 && !this.targetSet) {
                    this.target = enemy;
                    this.targetSet = true;
                    this.speedX = 4;
                }
            });
        }

        if (this.target != null) {
            // unsetting target
            if (this.target.delete || this.target.x + this.target.width < this.x) {
                this.targetSet = false;
                this.speedX = 3;
            }

            // following target
            if (this.y >= this.target.y + this.target.height * 0.5) this.speedY = -5;
            else if (this.y + this.height * 0.5 <= this.target.y) this.speedY = 5;
            else this.speedY = 0;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x >= 840) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

// Laser special attack
class Laser {
    constructor(level) {
        this.level = level;
        this.x = this.level.player.x + this.level.player.width;
        this.y = this.level.player.y + this.level.player.height * 0.5 - 5;
        this.width = 600;
        this.height = 10;
        this.duration = 500;
        this.timer = 0;
        this.delete = false;
        this.hit = false;   //helper for score deduction for boss
        this.damage = 100;
        this.specialType = "laser";
    }
    update(deltaTime) {
        if (this.timer < this.duration) {
            this.draw();
            this.timer += deltaTime;
        }
        else this.delete = true;
    }
    draw() {
        if (isLevelDark) mainCtx.fillStyle = "#150fd8";
        else mainCtx.fillStyle = "#282828";

        mainCtx.fillRect(this.x, this.y - 10, 10, 10);
        mainCtx.fillRect(this.x, this.y + 10, 10, 10);
        mainCtx.fillRect(this.x + 10, this.y, this.width, this.height);
    }
}

// Wall special attack
class Wall {
    constructor(level) {
        this.level = level;
        this.x = this.level.player.x + this.level.player.width;
        this.y = 50;
        this.width = 10;
        this.height = 430;
        this.speed = 4;
        this.hit = false;
        this.delete = false;
        this.damage = 100;
        this.specialType = "wall";
    }
    update() {
        this.x += this.speed;
        if (this.x > 840) this.delete = true;
        this.draw();
    }
    draw() {
        if (isLevelDark) mainCtx.fillStyle = "#2315c1";
        else mainCtx.fillStyle = "#282828";

        mainCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Enemy missile (boss attack)
class EnemyMissile {
    constructor(boss) {
        this.boss = boss;
        this.x = this.boss.x;
        this.y = this.boss.y + this.boss.height * 0.5;
        this.width = 50;
        this.height = 30;
        this.target = currentLevel.player;
        this.speedX = 3;
        this.speedY = 0;
        this.delete = false;
    }
    update() {
        // seeking missile targeting the player
        if (this.y >= this.target.y + this.target.height * 0.5) this.speedY = -3;
        else if (this.y + this.height * 0.5 <= this.target.y) this.speedY = 3;
        else this.speedY = 0;

        this.x -= this.speedX;
        this.y += this.speedY;

        if (this.x + this.width < 0) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.fillStyle = "#282828";
        mainCtx.fillRect(this.x, this.y + 10, 10, 10);
        mainCtx.fillRect(this.x + 10, this.y, 20, 30);
        mainCtx.fillRect(this.x + 30, this.y + 10, 10, 10);
        mainCtx.fillRect(this.x + 40, this.y, 10, 30);
    }
}
