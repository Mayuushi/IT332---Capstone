// Visual effects

// Explosion effect
class Explosion {
    constructor(x, y) {
        this.image = mainSprites;
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 70;
        this.spriteSize = 150;
        this.maxFrames = 5;
        this.frames = 1;
        this.staggeredFrames = 5;
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 8;
        if (isLevelDark) this.frameY = 9;
        this.delete = false;
    }
    update() {
        if (this.frames % this.staggeredFrames === 0) {
            this.frameX++;
            this.frames = 1;
        }
        else this.frames++;

        if (this.frameX >= this.maxFrames) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

// Star particle effect in the home screen
class Particle {
    constructor() {
        this.initialX = Math.floor(Math.random() * 440) + 200;
        this.initialY = Math.floor(Math.random() * 280) + 100;
        this.x = this.initialX;
        this.y = this.initialY;
        this.speedX = Math.abs(420 - this.x) * 0.0025;
        this.speedY = Math.random() * 0.3;
        if(this.initialX <= bgCanvas.width * 0.5) this.speedX *= -1;
        if(this.initialY <= bgCanvas.height * 0.5) this.speedY *= -1;
        this.radius = Math.random() * 2;
        this.color = "white";
        this.opacity = 0.001;
        this.increase = Math.random() * 0.01 + 0.001;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.increase;
        if(this.x < 0 || this. x > 840 || this.y < 0 || this.y > 480){
            this.x = this.initialX;
            this.y = this.initialY;
            this.opacity = 0.001;
        }
        this.draw();
    }
    draw() {
        bgCtx.save();
        bgCtx.globalAlpha = this.opacity;
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        bgCtx.fillStyle = this.color;
        bgCtx.fill();
        bgCtx.closePath();
        bgCtx.restore();
    }
}

// Initialize particles
const particles = [];
for(let i = 0; i< 100; i++){
    particles.push(new Particle());
}
