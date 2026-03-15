// Player class
class Player {
    constructor(level) {
        this.level = level;
        this.image = mainSprites;
        this.width = 100;      // sprite width and game width is same
        this.height = 70;
        this.x = 20;
        this.y = 220;
        this.speedX = 2.5;
        this.speedY = 3;
        this.frameX = 0;    //starting x coordinate of the box in sprite
        this.frameY = 0;    //starting y coordinate of the box in sprite  
        this.spriteSize = 150;  // size of each box(uniform all over sprite)
        if (isLevelDark) this.frameX = 1;
        this.hit = false;         // is player hit
        this.delete = false;
        this.hitbox = new Hitbox(this.x, this.y, this.width - 10, this.height - 20, 0, 10, false);
        this.shield = new Shield(this);
        this.shieldOn = true;
        this.shieldInterval = 4000;
        this.shieldTimer = 0;
    }
    update(deltaTime) {
        // shield
        if (this.shieldTimer <= this.shieldInterval) {
            this.shieldTimer += deltaTime;
            this.shield.update(deltaTime);
        }
        else this.shieldOn = false;

        // update hitbox
        this.hitbox.update(this.x, this.y);

        // x-axis limits
        if (keys.a.pressed && this.x >= 0) this.x -= this.speedX;
        if (keys.d.pressed && this.x <= mainCanvas.width - this.width) this.x += this.speedX;
        else this.x += 0;
        // y-axis limits
        if (keys.w.pressed && this.y >= 50) this.y -= this.speedY;
        if (keys.s.pressed && this.y <= mainCanvas.height - this.height) this.y += this.speedY;
        else this.y += 0;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
