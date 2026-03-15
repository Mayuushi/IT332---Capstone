class Boss {
    constructor() {
        this.image = bossSprites;
        this.isBoss = true;
        this.spriteTimer = 0;     //sprite animation helper
        this.spriteInterval = 200;
        this.fireTimer = 0;       // projectile firing timer
        this.spriteSize = 400;
        this.frameX = 0;
        this.maxFrames = 2;
        this.speedX = 2;
        this.speedY = 1.5;
        this.supportEnemies = [];
        this.chargeType = 0;     // 0: no charge, 1: fwd , 2: back and then fwd
        this.xMin = 20;
        this.charge = false;
        this.retreat = false;
        this.chargeTimer = 0;
        this.chargeInterval = 9000;
        this.support = false;
        this.delete = false;
    }
    update(deltaTime) {
        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;
            if (this.frameX >= this.maxFrames) this.frameX = 0;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        // projectile generation
        if (this.fireTimer > this.fireInteval) {
            currentLevel.enemyProjectiles.push(new Projectile(false, this));
            this.fireTimer = 0;
        }
        else this.fireTimer += deltaTime;


        // movement
        if (!this.charge && !this.retreat) {
            //entry and basic movement;
            if (this.x > this.xbreak + 1) this.x -= this.speedX;
            else if (this.x < this.xbreak - 1) this.x += this.speedX;
            else {
                if (this.y + this.height >= this.yMax || this.y <= this.yMin) this.speedY *= -1;
                this.y += this.speedY;
            }
        }
        if (this.chargeTimer > this.chargeInterval) {
            switch (this.chargeType) {
                case 1: this.charge = true;
                    break;
                case 2: this.retreat = true;
                    break;
                case 0: this.charge = false;
                    break;
            }
            this.chargeTimer = 0;
        }
        else this.chargeTimer += deltaTime;

        if (this.retreat) {
            this.retreatMovement();
        }

        if (this.charge) {
            this.chargeMovement();
        }

        //update hitbox
        this.hitbox.forEach(hb => hb.update(this.x, this.y));

        // support ship generation, collision, and deletion
        if (this.support) {
            if (this.supportTimer >= this.supportInterval) {
                this.supportGen();
                this.supportTimer = 0;
            } else this.supportTimer += deltaTime;

            this.supportEnemies.forEach((e, i) => {
                currentLevel.playerProjectiles.forEach(pp => {
                    if (checkCollision(pp, e)) {
                        e.hp -= 10;
                        if (e.hp <= 0) e.delete = true;
                        pp.delete = true;
                    }
                });
                currentLevel.playerSpecial.forEach(sp => {
                    if (checkCollision(sp, e)) {
                        e.delete = true;
                        currentLevel.explosions.push(new Explosion(e.x, e.y));
                        if (sp.specialType === "missile") sp.delete = true;
                    }
                });
                // collision detection with player and shield
                if (currentLevel.player.shieldOn) {
                    if (checkCollision(currentLevel.player.shield, e)) {
                        e.delete = true;
                        currentLevel.explosions.push(new Explosion(e.x, e.y));
                    }
                }
                else if (checkCollision(currentLevel.player, e)) {
                    if (!currentLevel.player.hit) {
                        currentLevel.player.hit = true;
                        currentLevel.explosions.push(new Explosion(e.x, e.y));
                        e.delete = true;
                        currentLevel.playerDead();
                    }
                }
                e.update(deltaTime);
                if (e.delete) this.supportEnemies.splice(i, 1);
            });
        }

        // draw
        this.draw();
    }
    chargeMovement() {
        if (this.x > this.xMin) this.x -= 4;
        else this.charge = false;
    }
    retreatMovement() {
        if (this.x <= 840) this.x += 2
        else {
            this.retreat = false;
            this.charge = true;
            this.y = this.chargeY;
        }
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
class Boss1 extends Boss {
    constructor() {
        super();
        this.width = 200;
        this.height = 230;
        this.x = 840;
        this.y = 120;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 50, this.height - 30, 50, 0, false)];
        this.xbreak = 550;
        this.hp = 200;
        this.score = 100;
        this.delete = false;
        this.frameY = 0;
        this.yMin = 50;
        this.yMax = 480;
        this.fireInteval = 1500;
    }
}
class Boss2 extends Boss {
    constructor() {
        super();
        this.width = 230;
        this.height = 210;
        this.x = 840;
        this.y = 120;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 50, this.height - 10, 50, 0, false)];
        this.xbreak = 550;
        this.hp = 200;
        this.score = 100;
        this.delete = false;
        this.frameY = 1;
        this.yMin = 50;
        this.yMax = 480;
        this.fireInteval = 1500;
    }
}
class Boss3 extends Boss {
    constructor() {
        super();
        this.width = 220;
        this.height = 200;
        this.x = 840;
        this.y = 120;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 10, this.height - 10, 10, 10, false)];
        this.xbreak = 500;
        this.hp = 300;
        this.score = 100;
        this.delete = false;
        this.frameY = 2;
        this.yMin = 50;
        this.yMax = 340;
        this.fireInteval = 1500;
        this.chargeType = 1;
    }
}
class Boss4 extends Boss {
    constructor() {
        super();
        this.width = 150;
        this.height = 250;
        this.x = 840;
        this.y = 120;
        this.hitbox = [
            new Hitbox(this.x, this.y, this.width, 70, 0, 0, false),
            new Hitbox(this.x, this.y, 100, 140, 50, 70, false)
        ];
        this.xbreak = 550;
        this.hp = 250;
        this.score = 100;
        this.delete = false;
        this.frameY = 3;
        this.yMin = 50;
        this.yMax = 450;
        this.fireInteval = 1500;
        this.support = true;
        this.supportTimer = 0;
        this.supportInterval = 3000;
    }
    supportGen() {
        currentLevel.enemyProjectiles.push(new EnemyMissile(this));
    }
}
class Boss5 extends Boss {
    constructor() {
        super();
        this.width = 190;
        this.height = 210;
        this.x = 840;
        this.y = 220;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 10, this.height - 10, 10, 10, false)];
        this.xbreak = 500;
        this.hp = 350;
        this.score = 100;
        this.delete = false;
        this.frameY = 4;
        this.yMin = 210;
        this.yMax = 480;
        this.fireInteval = 1500;
        this.chargeType = 1;
        this.support = true;
        this.supportTimer = 0;
        this.supportInterval = 4000;
    }
    supportGen() {
        this.supportEnemies.push(new Beetle(20, this.x, this.y + Math.random() * (this.height - 50), false, 3, 0, "linear", 0, 0));
    }
}
class Boss6 extends Boss {
    constructor() {
        super();
        this.width = 200;
        this.height = 190;
        this.x = 840;
        this.y = 220;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 30, this.height, 30, 0, false)];
        this.xbreak = 500;
        this.hp = 350;
        this.score = 100;
        this.delete = false;
        this.frameY = 5;
        this.yMin = 140;
        this.yMax = 480;
        this.fireInteval = 1500;
        this.speedX = 3;
        this.chargeY = 270;
        this.chargeInterval = 12000;
        this.chargeType = 2;
        this.support = true;
        this.supportTimer = 0;
        this.supportInterval = 4000;
    }
    supportGen() {
        this.supportEnemies.push(new Tadpole(20, this.x, this.y + Math.random() * (this.height - 50), false, 3, 0, "linear", 0, 0));
    }
}
class Boss7 extends Boss {
    constructor() {
        super();
        this.width = 300;
        this.height = 250;
        this.x = 840;
        this.y = 120;
        this.hitbox = [
            new Hitbox(this.x, this.y, this.width - 20, 120, 20, 10, false),
            new Hitbox(this.x, this.y, 220, this.height - 20, 80, 10, false),
            new Hitbox(this.x, this.y, this.width, 50, 0, 200, false)
        ];
        this.xbreak = 550;
        this.hp = 300;
        this.score = 100;
        this.delete = false;
        this.frameY = 6;
        this.yMin = 50;
        this.yMax = 400;
        this.fireInteval = 1500;
        this.chargeY = 60;
        this.chargeInterval = 12000;
        this.chargeType = 2;
        this.support = true;
        this.supportTimer = 0;
        this.supportInterval = 4000;
    }
    supportGen() {
        this.supportEnemies.push(new Flipper(20, this.x, this.y + Math.random() * (this.height - 60), false, 3, 0, "linear", 0, 0));
    }
}
class Boss8 extends Boss {
    constructor() {
        super();
        this.width = 380;
        this.height = 380;
        this.x = 840;
        this.y = 50;
        this.hitbox = [
            new Hitbox(this.x, this.y, this.width - 20, 120, 20, 10, true),
            new Hitbox(this.x, this.y, 100, 60, 100, 130, true),
            new Hitbox(this.x, this.y, 100, 60, 100, 220, true),
            new Hitbox(this.x, this.y, 90, 100, 210, 150, false)
        ];
        this.xbreak = 460;
        this.hp = 250;
        this.score = 100;
        this.delete = false;
        this.frameY = 7;
        this.fireTimer = 0;
        this.fireInteval = 3000;
        this.torpedoes = [
            new Torpedo(this.x, this.y, 50, 150),
            new Torpedo(this.x, this.y, 30, 220),
        ];
        this.retreat = false;
        this.retreatTimer = 0;
        this.retreatInterval = 6000;
        this.retreatFire = false;   // to trigger retreat swarm only once
    }
    update(deltaTime) {
        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;

            this.torpedoes.forEach(torp => {
                if (torp.hp > 0) {
                    if (torp.torpToggle) {
                        torp.y += 10;
                        torp.torpToggle = !torp.torpToggle;
                    } else {
                        torp.y -= 10;
                        torp.torpToggle = !torp.torpToggle;
                    }
                }
            });

            if (this.frameX >= this.maxFrames) this.frameX = 0;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        // torpedo
        this.torpedoes.forEach((torp, i) => {
            currentLevel.playerProjectiles.forEach(pp => {
                if (checkCollision(pp, torp)) {
                    torp.hp -= 5;
                    pp.delete = true;
                }
            });
            currentLevel.playerSpecial.forEach(sp => {
                if (checkCollision(sp, torp)) {
                    if (!sp.hit) {
                        sp.hit = true;
                        if (sp.specialType === "missile") {
                            sp.delete = true;
                            torp.hp -= 30;
                        }
                        else torp.hp -= 50;
                    }
                }
            });
            torp.update(this.x);
            if (torp.delete) this.torpedoes.splice(i, 1);
        });

        // projectile generation aka support ships
        if (this.fireTimer >= this.fireInteval && !this.retreat) {
            this.supportEnemies.push(new Triship(30, this.x, 240, false, 3, 0, "linear", 0, 0));
            this.fireTimer = 0;
        } else this.fireTimer += deltaTime;

        this.supportEnemies.forEach((e, i) => {
            currentLevel.playerProjectiles.forEach(pp => {
                if (checkCollision(pp, e)) {
                    e.hp -= 10;
                    if (e.hp <= 0) {
                        e.delete = true;
                        currentLevel.explosions.push(new Explosion(e.x, e.y));
                    }
                    pp.delete = true;
                }
            });
            currentLevel.playerSpecial.forEach(sp => {
                if (checkCollision(sp, e)) {
                    e.delete = true;
                    currentLevel.explosions.push(new Explosion(e.x, e.y));
                    if (sp.specialType === "missile") sp.delete = true;
                }
            });
            // collision detection with player and shield
            if (currentLevel.player.shieldOn) {
                if (checkCollision(currentLevel.player.shield, e)) {
                    e.delete = true;
                    currentLevel.explosions.push(new Explosion(e.x, e.y));
                }
            }
            else if (checkCollision(currentLevel.player, e)) {
                if (!currentLevel.player.hit) {
                    currentLevel.player.hit = true;
                    currentLevel.explosions.push(new Explosion(e.x, e.y));
                    e.delete = true;
                    currentLevel.playerDead();
                }
            }
            e.update(deltaTime);
            if (e.delete) this.supportEnemies.splice(i, 1);
        });

        // forward movement
        this.speedX = 0.105 * deltaTime;
        if (this.x > this.xbreak && !this.retreat) this.x -= this.speedX;

        // Retreat when both the torpedoes are fired & dragonfly swarm
        if (this.torpedoes.length === 0) {
            if (this.retreatTimer > this.retreatInterval && !this.retreat) {
                this.retreat = true;
                this.retreatTimer = 0;
            }
            if (this.retreat && this.x <= 840) {
                this.x += 2;    // retreat back out of the screen
            } else if (!this.retreatFire && this.retreat) {
                this.supportEnemies.push(new Dragonfly(40, 1040, 60, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1150, 60, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1040, 120, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1150, 120, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1040, 180, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1150, 180, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1040, 240, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1150, 240, false, 4, 0, "linear", 0, 0));
                this.retreatFire = true;
            }

            if (this.retreat && this.retreatTimer > this.retreatInterval) {
                this.retreat = false;
                this.retreatFire = false;
                this.retreatTimer = 0;
            }
            this.retreatTimer += deltaTime;
        }

        //update hitbox
        this.hitbox.forEach(hb => hb.update(this.x, this.y));

        this.draw();
    }
}

// UI class for displaying lives, spAtk and score;
