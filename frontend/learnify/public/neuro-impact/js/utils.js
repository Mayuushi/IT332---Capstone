// Hitbox class for collision detection
class Hitbox {
    constructor(x, y, width, height, offsetX, offsetY, immune) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.x = x + this.offsetX;
        this.y = y + this.offsetY;
        this.width = width;
        this.height = height;
        this.immune = immune;
    }
    update(x, y) {
        this.x = x + this.offsetX;
        this.y = y + this.offsetY;
        //this.draw();         //uncomment for debugging hitbox
    }
    draw() {
        bgCtx.fillStyle = "red";
        if (this.immune) bgCtx.fillStyle = "blue";
        bgCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Shield class for player
class Shield {
    constructor(player) {
        this.player = player;
        this.image = mainSprites
        this.x = this.player.x - 20;
        this.y = this.player.y - 20;
        this.width = 130;
        this.height = 110;
        this.spriteSize = 150;
        this.maxFrames = 2;
        this.frameXStart = 2;
        this.frameY = 0;
        if (isLevelDark) this.frameXStart = 4;
        this.frameX = this.frameXStart;
        this.spriteTimer = 0;
        this.spriteInterval = 150;
    }
    update(deltaTime) {
        this.x = this.player.x - 20;
        this.y = this.player.y - 20;

        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;
            if (this.frameX - this.frameXStart >= this.maxFrames) this.frameX = this.frameXStart;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

// Collision detection utility
function checkCollision(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y);
}
