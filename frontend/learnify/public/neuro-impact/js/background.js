// Background classes for different levels

class Background {
    constructor(level, frameX) {
        this.level = level;
        this.frameX = frameX;
        this.speed = 0;
        this.hitbox = [];
    }
    update(deltaTime) {
        if (!this.level.bgStop) {
            this.speed = 0.105 * deltaTime;  // 0.105 comes from 840px in 8000ms.
            this.x -= this.speed;
        }
        this.hitbox.forEach(hb => hb.update(this.x, this.y));
        if (this.x + this.width < 0) this.delete = true;
        this.draw();
    }
    draw() {
        bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.spriteY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

class Background2 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites1;
        this.spriteY = 0;           // y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 320;
        switch (frameX) {
            case 0: this.height = 160;
                break;
            case 1: this.height = 80;
                break;
            case 2: this.height = 60;
                break;
        }
        this.x = this.width * index;
        this.y = bgCanvas.height - this.height;
        this.delete = false;    // marked for deletion
    }
}

class Background3 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites1;
        this.spriteY = 200;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 320;
        this.x = this.width * index;
        this.hitbox = [];
        switch (frameX) {
            case 0: this.height = 70;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, this.height - 10, 0, 10, false));
                break;
            case 1: this.height = 80;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, this.height - 20, 0, 20, false));
                break;
            case 2: this.height = 160;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, 60, 60, 0, 100, false));
                this.hitbox.push(new Hitbox(this.x, this.y, 30, 130, 60, 30, false));
                this.hitbox.push(new Hitbox(this.x, this.y, 100, 150, 90, 10, false));
                this.hitbox.push(new Hitbox(this.x, this.y, 60, 120, 230, 40, false));
                break;
        }
        this.delete = false;    // marked for deletion
    }
}

class Background4 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites1;
        this.spriteY = 400;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 320;
        this.x = this.width * index;
        switch (frameX) {
            case 0: this.height = 70;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, this.height - 20, 0, 20, false));
                break;
            case 1: this.height = 80;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, this.height - 20, 0, 20, false));
                break;
            case 2: this.height = 160;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, 60, 0, 100, false));
                this.hitbox.push(new Hitbox(this.x, this.y, 60, 150, 100, 10, false));
        }
        this.delete = false;    // marked for deletion
    }
}

class Background5 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites1;
        this.spriteY = 600;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 320;
        this.x = this.width * index;
        this.y = 50;
        switch (frameX) {
            case 0: this.height = 170;
                break;
            case 1: this.height = 80;
                break;
            case 2: this.height = 50;
                break;
        }
        this.hitbox.push(new Hitbox(this.x, this.y, this.width - 40, this.height - 5, 20, 0, false));
        this.delete = false;    // marked for deletion
    }
}

class Background7 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites2;
        this.spriteY = 0;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 2800;
        this.height = 160;
        this.x = this.width * index;
        this.y = bgCanvas.height - this.height;
        this.delete = false;    // marked for deletion
        this.hitbox = [
            new Hitbox(this.x, 430, this.width, 50, 0, 110, false),
            new Hitbox(this.x, this.y, 60, 150, 1880, 10, false),
            new Hitbox(this.x, this.y, 60, 150, 2200, 10, false)
        ];
    }
}

class Background8 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites2;
        this.spriteY = 200;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 2800;
        this.height = 160;
        this.x = this.width * index;
        this.y = bgCanvas.height - this.height;
        this.delete = false;    // marked for deletion
        this.hitbox = [
            new Hitbox(this.x, 430, this.width, 50, 0, 110, false),
            new Hitbox(this.x, this.y, 110, 100, 670, 60, false),
            new Hitbox(this.x, this.y, 100, 150, 780, 10, false),
            new Hitbox(this.x, this.y, 110, 100, 990, 60, false),
            new Hitbox(this.x, this.y, 100, 150, 1100, 10, false),
            new Hitbox(this.x, this.y, 110, 100, 1950, 60, false),
            new Hitbox(this.x, this.y, 100, 150, 2060, 10, false)
        ];
    }
}
