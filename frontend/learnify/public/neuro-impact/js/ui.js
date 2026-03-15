// UI for displaying lives, special attacks, and score
class UI {
    constructor() {
        this.image = mainSprites;
        this.frameX = 6;       // grid x on spritesheet
        this.heartY = 3;       // grid y on spritesheet
        this.missileY = 0;
        this.laserY = 5;
        this.wallY = 7;
        if (isLevelDark) {
            this.heartY++;
            this.missileY++;
            this.laserY++;
            this.wallY++;
        }
        this.spriteSize = 150;
        this.width = 50;
        this.height = 40;
    }
    draw() {
        // drawing hearts for lives
        for (let i = 0; i < lives; i++) {
            bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.heartY * this.spriteSize, this.width, this.height, i * 55 + 5, 5, this.width, this.height);
        }

        // drawing special Attack and the counts remining;
        switch (specialAtttack) {
            case "missile": bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.missileY * this.spriteSize, this.width, this.height, 400, 10, this.width, this.height);
                break;
            case "laser": bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.laserY * this.spriteSize, this.width, this.height, 400, 5, this.width, this.height);
                break;
            case "wall": bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.wallY * this.spriteSize, this.width, this.height, 400, 5, this.width, this.height);
                break;
        }
        bgCtx.save();
        if (isLevelDark) bgCtx.fillStyle = "#aad69c";
        else bgCtx.fillStyle = "#282828";
        bgCtx.font = "bold 52px Silkscreen";
        bgCtx.fillText(specialCount.toString().padStart(2, "0"), 460, 45);

        //score
        bgCtx.fillText(playerScore.toString().padStart(5, "0"), 600, 45);

        // high score
        bgCtx.font = "bold 22px Silkscreen";
        bgCtx.fillText("BEST: " + playerHighScore.toString().padStart(5, "0"), 600, 67);
        bgCtx.restore();
    }
}
