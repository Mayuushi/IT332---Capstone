// Level class
class Level {
    constructor(level, isDark) {
        this.active = true;
        this.number = level;     // level number
        isLevelDark = isDark;
        if (isLevelDark) bgCanvas.style.background = "#282828";
        else bgCanvas.style.background = "#aad69c";
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.ui = new UI();
        this.sourceEnemyArray = [];
        this.enemies = [];
        this.playerProjectiles = [];
        this.playerSpecial = [];      // special weapons
        this.enemyProjectiles = [];
        this.background = [];
        this.explosions = [];
        this.i = 0;         // index for global level enemy array
        this.levelTime = 0;
        this.flag = true;     // prevents index overflow of enemy array
        this.bgStop = false;  // stops background
        this.levelComplete = false;

        // create background and assigns enemy array of the current level
        switch (this.number) {
            case 1: this.sourceEnemyArray = enemiesLvl1;
                break;
            case 2: this.sourceEnemyArray = enemiesLvl2;
                bgArray2.forEach((frame, index) => this.background.push(new Background2(this, frame, index)));
                break;
            case 3: this.sourceEnemyArray = enemiesLvl3;
                bgArray3.forEach((frame, index) => this.background.push(new Background3(this, frame, index)));
                break;
            case 4: this.sourceEnemyArray = enemiesLvl4;
                bgArray4.forEach((frame, index) => this.background.push(new Background4(this, frame, index)));
                break;
            case 5: this.sourceEnemyArray = enemiesLvl5;
                bgArray5.forEach((frame, index) => this.background.push(new Background5(this, frame, index)));
                break;
            case 6: this.sourceEnemyArray = enemiesLvl6;
                bgArray6.forEach((frame, index) => this.background.push(new Background5(this, frame, index))); // lvl 5 & 6 have same bg
                break;
            case 7: this.sourceEnemyArray = enemiesLvl7;
                bgArray7.forEach((frame, index) => this.background.push(new Background7(this, frame, index)));
                break;
            case 8: this.sourceEnemyArray = enemiesLvl8;
                bgArray8.forEach((frame, index) => this.background.push(new Background8(this, frame, index)));
                break;
        }
    }
    update(deltaTime) {
        // ui draw
        this.ui.draw();

        // player update
        if (!this.player.delete) this.player.update(deltaTime);

        // player projectiles
        this.playerProjectiles.forEach(projectile => projectile.update());
        this.playerProjectiles = this.playerProjectiles.filter(projectile => !projectile.delete);

        // player special attack
        this.playerSpecial.forEach(special => special.update(deltaTime));
        this.playerSpecial = this.playerSpecial.filter(special => !special.delete);

        // pushing enemies from source array into the level enemies array
        if (this.flag && this.levelTime > this.sourceEnemyArray[this.i].time) {
            this.swarm(this.sourceEnemyArray[this.i].object);
            this.i++;
            if (this.i >= this.sourceEnemyArray.length) {
                this.flag = false;
                this.bgStop = true;
            }
        }

        //updating all the enemies, and thier collision detection
        this.enemies.forEach(enemy => {

            enemy.update(deltaTime);

            // interaction with player projectile;
            this.playerProjectiles.forEach(pp => {
                if (enemy.isBoss) {   // for boss
                    enemy.hitbox.forEach(hb => {
                        if (checkCollision(hb, pp)) {
                            pp.delete = true;
                            if (!hb.immune) {
                                enemy.hp -= 5;
                                playerScore += 5;
                                if (enemy.hp <= 0) {
                                    playerScore += enemy.score;
                                    for (let i = 0; i < 3; i++) {  //add 3 explosions
                                        this.explosions.push(new Explosion(Math.random() * enemy.width + enemy.x, Math.random() * enemy.height + enemy.y));
                                    }
                                    this.levelComplete = true;
                                    enemy.delete = true;
                                }
                            }
                        }
                    });
                }
                else if (checkCollision(pp, enemy)) {   // for others
                    if (enemy.isPowerUp) pp.delete = true;
                    else {
                        pp.delete = true;
                        enemy.hp -= 10;
                        if (enemy.hp <= 0) {
                            this.explosions.push(new Explosion(enemy.x, enemy.y));
                            playerScore += enemy.score;
                            enemy.delete = true;
                        }
                    }
                }
            });

            //interaction with player special attack
            this.playerSpecial.forEach(sp => {
                if (enemy.isBoss) {         // for boss
                    enemy.hitbox.forEach(hb => {
                        if (checkCollision(hb, sp)) {
                            if (sp.specialType === "missile") sp.delete = true;
                            if (!hb.immune) {
                                if (!sp.hit) {
                                    enemy.hp -= sp.damage;
                                    sp.hit = true;
                                    playerScore += sp.damage;
                                    if (enemy.hp <= 0) {
                                        playerScore += enemy.score;
                                        for (let i = 0; i < 3; i++) {  //add 3 explosions
                                            this.explosions.push(new Explosion(Math.random() * enemy.width + enemy.x, Math.random() * enemy.height + enemy.y));
                                        }
                                        this.levelComplete = true;
                                        enemy.delete = true;
                                    }
                                }

                            }
                        }
                    });
                }
                else if (!enemy.isPowerUp) {  // everyone except powerup
                    if (checkCollision(sp, enemy)) {
                        if (!enemy.hit || !sp.hit) {
                            enemy.hp -= sp.damage;
                            enemy.hit = true;
                            sp.hit = true;
                            if (enemy.hp <= 0) {
                                this.explosions.push(new Explosion(enemy.x, enemy.y));
                                playerScore += enemy.score;
                                enemy.delete = true;
                            }
                        }
                        if (sp.specialType === "missile") sp.delete = true;
                    }
                }
            });

            //interaction with player and its shield
            if (enemy.isPowerUp) {
                if (checkCollision(enemy, this.player.hitbox)) {
                    enemy.delete = true;
                    if (enemy.powerup === "life") {
                        if (lives === maxLives) specialCount++;
                        else lives++;
                    }
                    else if (specialAtttack === enemy.powerup) {
                        if (specialAtttack === "wall") specialCount++;
                        else specialCount += 3;
                    }
                    else {
                        specialAtttack = enemy.powerup;
                        if (specialAtttack == "wall") specialCount = 1;
                        else specialCount = 3;
                    }
                }
            }
            else if (enemy.isBoss) {
                enemy.hitbox.forEach(hb => {
                    if (this.player.shieldOn) {   //when shieldOn check with shield
                        if (checkCollision(hb, this.player.shield)) {
                            enemy.hp -= 1;
                            playerScore += 1;
                            if (enemy.hp <= 0) {
                                playerScore += enemy.score;
                                for (let i = 0; i < 3; i++) {  //add 3 explosions
                                    this.explosions.push(new Explosion(Math.random() * enemy.width + enemy.x, Math.random() * enemy.height + enemy.y));
                                }
                                this.levelComplete = true;
                                enemy.delete = true;
                            }
                        }
                    }
                    else if (checkCollision(hb, this.player.hitbox)) {
                        if (!this.player.hit) {
                            this.player.hit = true;
                            this.explosions.push(new Explosion(this.player.x, this.player.y));
                            this.playerDead();
                        }
                    }
                });
            }
            else {
                if (this.player.shieldOn) {  //other enemies, when shield is on
                    if (checkCollision(this.player.shield, enemy)) {
                        playerScore += enemy.score;
                        this.explosions.push(new Explosion(enemy.x, enemy.y));
                        enemy.delete = true;
                    }
                }
                // other enemies when shield is off
                else if (checkCollision(enemy, this.player.hitbox)) {
                    if (!this.player.hit) {
                        this.player.hit = true;
                        this.explosions.push(new Explosion(this.player.x, this.player.y));
                        this.explosions.push(new Explosion(enemy.x, enemy.y));
                        enemy.delete = true;
                        this.playerDead();
                    }
                }
            }
        });
        this.enemies = this.enemies.filter(enemy => !enemy.delete);

        //enemy projectiles
        this.enemyProjectiles.forEach(projectile => {
            projectile.update();
            // interaction with player projectile
            this.playerProjectiles.forEach(pp => {
                if (checkCollision(projectile, pp)) {
                    this.explosions.push(new Explosion(pp.x, pp.y));
                    pp.delete = true;
                    projectile.delete = true;
                }
            });
            // interaction with player special attack
            this.playerSpecial.forEach(sp => {
                if (checkCollision(projectile, sp)) {
                    projectile.delete = true;
                }
            });
            // interaction with player 
            if (!this.player.shieldOn && checkCollision(this.player.hitbox, projectile)) {
                if (!this.player.hit && this.active) {
                    this.player.hit = true;
                    projectile.delete = true;
                    this.explosions.push(new Explosion(this.player.x, this.player.y));
                    this.playerDead();
                }
            }
            //interaction with player shield
            if (this.player.shieldOn) {
                if (checkCollision(this.player.shield, projectile)) {
                    projectile.delete = true;
                }
            }
        });
        this.enemyProjectiles = this.enemyProjectiles.filter(projectile => !projectile.delete);

        // explosions update
        this.explosions.forEach(explosion => explosion.update());
        this.explosions = this.explosions.filter(explosion => !explosion.delete);

        // background and collision detection with player and projectiles
        this.background.forEach(bg => {
            bg.update(deltaTime);
            bg.hitbox.forEach(hb => {
                if (checkCollision(this.player.hitbox, hb)) {
                    if (!this.player.hit) {
                        this.player.hit = true;
                        this.explosions.push(new Explosion(this.player.x, this.player.y));
                        this.playerDead();
                    }
                }

                this.playerProjectiles.forEach(pp => {
                    if (checkCollision(pp, hb)) {
                        pp.delete = true;
                    }
                })
            })
        });
        this.background = this.background.filter(bg => !bg.delete);

        //level complete;
        if (this.levelComplete) {
            this.active = false;
            if (this.number != 5 && this.number != 6) {
                if (this.player.y <= 55) this.player.x += 5;
                else this.player.y -= 2;
            }
            else {
                if (this.player.y + this.player.height >= 400) this.player.x += 5;
                else this.player.y += 2;
            }
            //player crosses canvas width and next level
            if (this.player.x >= 840) {
                if (this.number === 8) {
                    gameOver = true;
                }
                else if (this.number != 4 && this.number != 5) {
                    nextLevel(this.number + 1, false);
                }
                else {
                    nextLevel(this.number + 1, true);
                }
            }
        }

        this.levelTime += deltaTime;
    }
    swarm(array) {
        array.forEach(object => {
            this.enemies.push(object);
        })
    }
    playerDead() {
        this.player.delete = true;
        lives--;
        if (lives > 0) setTimeout(() => { this.player = new Player(); }, 500);
        else setTimeout(() => {
            gameOver = true;
        }, 500);
    }
}

// all level enemies source array
const enemiesLvl1 = [
    {
        time: 2000,
        object: [
            new Meteor(10, 840, 80, false, 3.5, 0, "linear", 0, 0),
            new Meteor(10, 1040, 80, false, 3.5, 0, "linear", 0, 0),
            new Meteor(10, 1240, 80, false, 3.5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 5000,
        object: [
            new Meteor(10, 840, 200, false, 3.5, 0, "linear", 0, 0),
            new Meteor(10, 1040, 200, false, 3.5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 8000,
        object: [
            new Meteor(10, 840, 200, false, 2, 0, "linear", 0, 0),
            new Meteor(10, 1040, 200, false, 2, 0, "linear", 0, 0)
        ]
    },
    {
        time: 12000,
        object: [
            new Meteor(10, 840, 300, false, 3, 0, "linear", 0, 0),
            new Meteor(10, 1040, 300, false, 3, 0, "linear", 0, 0),
            new Meteor(10, 1240, 300, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 15000,
        object: [
            new Meteor(25, 840, 80, false, 3, 0, "linear", 0, 0),
            new PowerUp(950, 70, 3, 0, "linear", 0, 0),
            new Meteor(25, 1120, 80, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 21000,
        object: [
            new Triship(15, 840, 50, false, 2, 1.5, "zigzag", 300, 620),
            new Triship(15, 960, 200, false, 2, 0.03, "wave", 120, 200),
            new Triship(15, 1080, 50, false, 2, 1.5, "zigzag", 300, 620),
            new Triship(15, 1200, 200, false, 2, 0.03, "wave", 120, 200),
            new Triship(15, 1320, 50, false, 2, 1.5, "zigzag", 300, 620),
            new Triship(15, 1440, 200, false, 2, 0.03, "wave", 120, 200),
            new Triship(15, 1560, 50, false, 2, 1.5, "zigzag", 300, 620),
            new Triship(15, 1680, 200, false, 2, 0.03, "wave", 120, 200)
        ]
    },
    {
        time: 35500,
        object: [new Squid(10, 840, 280, false, 3, 0, "linear", 0, 0)]
    },
    {
        time: 38000,
        object: [
            new Squid(10, 840, 70, false, 3, 0, "linear", 0, 0),
            new Squid(10, 1000, 70, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 41000,
        object: [new Squid(10, 840, 200, true, 2, 0.03, "wave", 120, 200)]
    },
    {
        time: 42500,
        object: [new Squid(10, 840, 200, true, 2, 0.03, "wave", 120, 200)]
    },
    {
        time: 44000,
        object: [new Squid(10, 840, 200, true, 2, 0.03, "wave", 120, 200)]
    },
    {
        time: 45500,
        object: [new Squid(10, 840, 200, true, 2, 0.03, "wave", 120, 200)]
    },
    {
        time: 49000,
        object: [
            new Squid(10, 840, 50, true, 3, 2, "zigzag", 300, 620),
            new Squid(10, 1040, 50, true, 3, 2, "zigzag", 300, 620),
            new Squid(10, 1240, 50, true, 3, 2, "zigzag", 300, 620),
            new Squid(10, 1440, 50, true, 3, 2, "zigzag", 300, 620)
        ]
    },
    {
        time: 57000,
        object: [new PowerUp(840, 280, 3, 0, "linear", 0, 0)]
    },
    {
        time: 61000,
        object: [
            new Shuttle(15, 840, 50, false, 3, 0, "linear", 0, 0),
            new Shuttle(15, 1000, 110, false, 2, 0, "linear", 0, 0),
            new Shuttle(15, 1100, 60, false, 2, 0, "linear", 0, 0),
            new Shuttle(15, 1300, 330, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 68000,
        object: [new Boss1()] //boss
    }
];
isLevelDark = false;//solves bug, otherwise need to declare level before
const enemiesLvl2 = [
    {
        time: 2000,
        object: [
            new Triship(15, 840, 50, false, 2, 1, "zigzag", 300, 780),
            new Triship(15, 840, 300, false, 2, -1, "zigzag", 300, 780),
            new Triship(15, 960, 50, false, 2, 1, "zigzag", 300, 780),
            new Triship(15, 960, 300, true, 2, -1, "zigzag", 300, 780),
            new Triship(15, 1080, 50, true, 2, 1, "zigzag", 300, 780),
            new Triship(15, 1080, 300, false, 2, -1, "zigzag", 300, 780)
        ]
    },
    {
        time: 8000,
        object: [
            new Saucer(20, 840, 100, false, 2, 0.03, "wave", 50, 100),
            new Saucer(20, 840, 340, false, 2, 0.03, "wave", 50, 340)
        ]
    },
    {
        time: 9000,
        object: [
            new Saucer(20, 840, 100, false, 2, 0.03, "wave", 50, 100),
            new Saucer(20, 840, 340, true, 2, 0.03, "wave", 50, 340),
            new PowerUp(840, 220, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 10000,
        object: [
            new Saucer(20, 840, 100, true, 2, 0.03, "wave", 50, 100),
            new Saucer(20, 840, 340, false, 2, 0.03, "wave", 50, 340)
        ]
    },
    {
        time: 13000,
        object: [
            new Squid(15, 840, 50, true, 2, 1, "zigzag", 250, 780),
            new Squid(15, 1200, 130, true, 3, 0.07, "wave", 40, 130),
            new Squid(15, 1200, 350, true, 2, 0.05, "wave", 40, 350),
            new Squid(15, 1800, 240, true, 3, 0, "linear", 0, 0),
            new Squid(15, 2000, 120, true, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 21000,
        object: [
            new Squid(15, 840, 240, false, 3, 0, "linear", 0, 0),
            new Squid(15, 940, 170, false, 3, 0, "linear", 0, 0),
            new Squid(15, 940, 310, false, 3, 0, "linear", 0, 0),
            new Squid(15, 1040, 100, false, 3, 0, "linear", 0, 0),
            new Squid(15, 1040, 380, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 24000,
        object: [
            new Squid(15, 840, 240, false, 3, 0, "linear", 0, 0),
            new Squid(15, 940, 170, false, 3, 0, "linear", 0, 0),
            new Squid(15, 940, 310, false, 3, 0, "linear", 0, 0),
            new Squid(15, 1040, 100, false, 3, 0, "linear", 0, 0),
            new Squid(15, 1040, 380, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 28000,
        object: [
            new Shuttle(25, 840, 250, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 960, 250, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1080, 250, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1200, 250, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1320, 250, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 30000,
        object: [
            new Shuttle(25, 840, 70, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1040, 70, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1240, 250, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1440, 220, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1640, 150, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1840, 220, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 38000,
        object: [new Boss2()]  //boss
    }
];
const enemiesLvl3 = [
    {
        time: 2000,
        object: [
            new Tadpole(15, 840, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1020, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1200, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1380, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1560, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1740, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1920, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 2100, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 2280, 50, true, 2, 1, "zigzag", 250, 750)
        ]
    },
    {
        time: 16000,
        object: [
            new Saucer(15, 840, 280, false, 4, 0, "linear", 0, 0),
            new Saucer(15, 1040, 280, false, 4, 0, "linear", 0, 0),
            new Saucer(15, 1240, 280, false, 4, 0, "linear", 0, 0),
            new PowerUp(1340, 280, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 22000,
        object: [
            new Squid(20, 840, 180, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1000, 120, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1000, 240, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1160, 60, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1160, 300, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 26000,
        object: [
            new Squid(20, 840, 180, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1000, 120, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1000, 240, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1160, 60, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1160, 300, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 30000,
        object: [new Marble1(20, 840, 110, true, 3, 0.04, "wave", 50, 110)]
    },
    {
        time: 30300,
        object: [new Marble2(20, 840, 110, true, 3, 0.04, "wave", 50, 110)]
    },
    {
        time: 30600,
        object: [
            new Marble3(20, 840, 110, true, 3, 0.04, "wave", 50, 110),
            new Marble1(20, 840, 270, true, 3, 0.04, "wave", 50, 270)
        ]
    },
    {
        time: 30900,
        object: [new Marble2(20, 840, 270, true, 3, 0.04, "wave", 50, 270)]
    },
    {
        time: 31200,
        object: [new Marble3(20, 840, 270, true, 3, 0.04, "wave", 50, 270)]
    },
    {
        time: 33000,
        object: [new Kraken(150, 840, 150, true, 3, 2, "mini1", 0, 480)]
    },
    {
        time: 51000,
        object: [new Boss3()]   //boss
    }
];
const enemiesLvl4 = [
    {
        time: 2000,
        object: [
            new Beetle(15, 840, 50, true, 3, 1, "zigzag", 700, 800),
            new Beetle(15, 990, 50, true, 3, 1, "zigzag", 700, 800),
            new Beetle(15, 1140, 50, false, 3, 1, "zigzag", 700, 800),
            new Beetle(15, 1290, 50, true, 3, 1, "zigzag", 700, 800),
            new Beetle(15, 1440, 50, false, 3, 1, "zigzag", 700, 800)
        ]
    },
    {
        time: 6000,
        object: [
            new Beetle(15, 840, 50, true, 3, 2, "zigzag", 400, 700),
            new Beetle(15, 990, 50, false, 3, 2, "zigzag", 400, 700),
            new Beetle(15, 1140, 50, true, 3, 2, "zigzag", 400, 700),
            new Beetle(15, 1290, 50, false, 3, 2, "zigzag", 400, 700),
            new Beetle(15, 1440, 50, true, 3, 2, "zigzag", 400, 700)
        ]
    },
    {
        time: 10000,
        object: [
            new Beetle(15, 840, 270, true, 3, -2, "zigzag", 370, 700),
            new Beetle(15, 990, 270, true, 3, -2, "zigzag", 370, 700),
            new Beetle(15, 1140, 270, false, 3, -2, "zigzag", 370, 700),
            new Beetle(15, 1290, 270, false, 3, -2, "zigzag", 370, 700),
            new Beetle(15, 1440, 270, true, 3, -2, "zigzag", 370, 700)
        ]
    },
    {
        time: 14500,
        object: [new Shuttle(15, 840, 250, false, 3, 0, "linear", 0, 0)]
    },
    {
        time: 17500,
        object: [
            new Shuttle(15, 840, 120, false, 3, 0, "linear", 0, 0),
            new Shuttle(15, 980, 120, false, 3, 0, "linear", 0, 0),
            new Shuttle(15, 1120, 120, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 20500,
        object: [new Shuttle(25, 840, 250, false, 3, 0, "linear", 0, 0)]
    },
    {
        time: 24000,
        object: [
            new Shuttle(15, 840, 180, false, 4, 0, "linear", 0, 0),
            new Shuttle(15, 980, 180, false, 4, 0, "linear", 0, 0),
            new Shuttle(15, 1120, 180, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 29300,
        object: [new PowerUp(840, 180, 1.788, 0.07, "wave", 80, 180)]
    },
    {
        time: 36000,
        object: [
            new Rock(80, 840, 130, false, 2, 0, "linear", 0, 0),
            new Rock(80, 1040, 180, false, 2, 0, "linear", 0, 0),
            new Rock(80, 1240, 240, false, 2, 0, "linear", 0, 0),
            new Rock(80, 1440, 90, false, 2, 0, "linear", 0, 0),
            new Rock(80, 1640, 250, false, 2, 0, "linear", 0, 0)
        ]
    },
    {
        time: 50500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 51000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 51500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 52000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 52500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 53000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 53500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 54000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 54500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 58000,
        object: [
            new Triship(20, 840, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 940, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 1160, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 1260, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 1480, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 1580, 50, true, 3, 3, "zigzag", 600, 800)
        ]
    },
    {
        time: 66500,
        object: [new Boss4()] //boss
    }
];
isLevelDark = true;
const enemiesLvl5 = [
    {
        time: 2000,
        object: [
            new Marble3(15, 840, 440, true, 2.8, -2, "zigzag", 300, 600),
            new Marble3(15, 1000, 440, true, 2.8, -2, "zigzag", 300, 600),
            new Marble3(15, 1160, 440, true, 2.8, -2, "zigzag", 300, 600),
            new Marble3(15, 1320, 440, true, 2.8, -2, "zigzag", 300, 600),
            new Marble3(15, 1480, 440, true, 2.8, -2, "zigzag", 300, 600)
        ]
    },
    {
        time: 4000,
        object: [
            new Marble3(15, 840, 410, false, 3.5, 0, "linear", 0, 0),
            new Marble3(15, 1000, 410, false, 3.5, 0, "linear", 0, 0),
            new Marble3(15, 1160, 410, false, 3.5, 0, "linear", 0, 0),
            new Marble3(15, 1320, 410, false, 3.5, 0, "linear", 0, 0),
            new Marble3(15, 1480, 410, false, 3.5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 9500,
        object: [new Kraken(100, 840, 390, true, 2, -3, "zigzag", 500, 600)]
    },
    {
        time: 16000,
        object: [new PowerUp(840, 300, 2, 0.07, "wave", 100, 300)]
    },
    {
        time: 21000,
        object: [
            new Tadpole(15, 840, 320, true, 3, 0.07, "wave", 110, 320),
            new Tadpole(15, 940, 320, true, 2, 0.05, "wave", 110, 320),
            new Tadpole(15, 1040, 320, false, 2, 0.08, "wave", 110, 320),
            new Tadpole(15, 1140, 320, false, 3, 0.03, "wave", 110, 320),
            new Tadpole(15, 1240, 320, true, 3, 0.09, "wave", 110, 320),
            new Tadpole(15, 1340, 320, false, 2, 0.04, "wave", 110, 320),
            new Tadpole(15, 1440, 320, false, 3, 0.06, "wave", 110, 320),
            new Tadpole(15, 1540, 320, true, 3, 0.03, "wave", 110, 320),
            new Tadpole(15, 1640, 320, false, 3, 0.07, "wave", 110, 320)
        ]
    },
    {
        time: 30000,
        object: [
            new Squid(25, 840, 320, false, 4, 0, "linear", 0, 0),
            new Squid(25, 980, 230, false, 4, 0, "linear", 0, 0),
            new Squid(25, 980, 410, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 32000,
        object: [
            new Squid(25, 840, 320, false, 4, 0, "linear", 0, 0),
            new Squid(25, 980, 230, false, 4, 0, "linear", 0, 0),
            new Squid(25, 980, 410, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 34000,
        object: [
            new Triship(15, 840, 210, false, 2, 1, "zigzag", 225, 600),
            new Triship(15, 840, 410, false, 2, -1, "zigzag", 225, 600),
            new Triship(15, 1000, 210, false, 2, 1, "zigzag", 225, 600),
            new Triship(15, 1000, 410, true, 2, -1, "zigzag", 225, 600),
            new Triship(15, 1160, 210, true, 2, 1, "zigzag", 225, 600),
            new Triship(15, 1160, 410, false, 2, -1, "zigzag", 225, 600),
            new Triship(15, 1320, 210, false, 2, 1, "zigzag", 225, 600),
            new Triship(15, 1320, 410, true, 2, -1, "zigzag", 225, 600),
            new Triship(15, 1480, 210, true, 2, 1, "zigzag", 225, 600),
            new Triship(15, 1480, 410, false, 2, -1, "zigzag", 225, 600)
        ]
    },
    {
        time: 46000,
        object: [
            new Squid(25, 840, 160, true, 3, 2, "zigzag", 400, 760),
            new Squid(25, 980, 160, true, 3, 2, "zigzag", 400, 760),
            new Squid(25, 1120, 160, true, 3, 2, "zigzag", 400, 760),
            new Squid(25, 1260, 160, true, 3, 2, "zigzag", 400, 760),
            new Squid(25, 1400, 160, true, 3, 2, "zigzag", 400, 760)
        ]
    },
    {
        time: 53000,
        object: [
            new Squid(15, 840, 430, true, 3, -2, "zigzag", 350, 650),
            new Squid(15, 980, 430, true, 3, -2, "zigzag", 350, 650),
            new Squid(15, 1120, 430, true, 3, -2, "zigzag", 350, 650),
            new Squid(15, 1260, 430, true, 3, -2, "zigzag", 350, 650),
            new Squid(15, 1400, 430, true, 3, -2, "zigzag", 350, 650)
        ]
    },
    {
        time: 56000,
        object: [new Squid(150, 840, 180, true, 1.8, -2, "mini2", 300, 450)]
    },
    {
        time: 75200,
        object: [new Boss5()]   //boss
    }
];
const enemiesLvl6 = [
    {
        time: 2000,
        object: [
            new Triship(15, 840, 350, false, 6, 0, "linear", 0, 0),
            new Triship(15, 980, 300, false, 6, 0, "linear", 0, 0),
            new Triship(15, 1120, 250, false, 6, 0, "linear", 0, 0),
            new Triship(15, 1260, 200, false, 6, 0, "linear", 0, 0),
            new Triship(15, 1400, 150, false, 6, 0, "linear", 0, 0)
        ]
    },
    {
        time: 4000,
        object: [
            new Squid(15, 840, 220, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 960, 220, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 1080, 220, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 1200, 220, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 1320, 220, true, 4, 2, "zigzag", 300, 700)
        ]
    },
    {
        time: 7500,
        object: [
            new Triship(15, 840, 410, false, 5, 0, "linear", 0, 0),
            new Triship(15, 980, 360, false, 5, 0, "linear", 0, 0),
            new Triship(15, 1120, 310, false, 5, 0, "linear", 0, 0),
            new Triship(15, 1260, 260, false, 5, 0, "linear", 0, 0),
            new Triship(15, 1400, 210, false, 5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 10000,
        object: [new PowerUp(840, 240, 4, 0, "linear", 0, 0)]
    },
    {
        time: 12000,
        object: [new Beetle(15, 840, 350, true, 4, 0.04, "wave", 50, 350)]
    },
    {
        time: 12500,
        object: [new Beetle(15, 840, 350, true, 4, 0.04, "wave", 50, 350)]
    },
    {
        time: 13000,
        object: [new Beetle(15, 840, 350, true, 4, 0.04, "wave", 50, 350)]
    },
    {
        time: 13500,
        object: [new Beetle(15, 840, 350, true, 4, 0.04, "wave", 50, 350)]
    },
    {
        time: 15000,
        object: [
            new Saucer(20, 840, 210, true, 4, 0.05, "linear", 50, 100),
            new Saucer(20, 840, 380, true, 4, 0.06, "wave", 50, 380),
            new PowerUp(840, 270, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 15500,
        object: [
            new Saucer(20, 840, 210, true, 4, 0.04, "linear", 50, 100),
            new Saucer(20, 840, 380, true, 4, 0.06, "wave", 50, 380)
        ]
    },
    {
        time: 16000,
        object: [
            new Saucer(20, 840, 210, true, 4, 0.04, "linear", 50, 100),
            new Saucer(20, 840, 380, true, 4, 0.06, "wave", 50, 380)
        ]
    },
    {
        time: 20000,
        object: [
            new Triship(15, 840, 210, false, 4, 4, "zigzag", 400, 600),
            new Triship(15, 840, 410, false, 4, -4, "zigzag", 400, 600),
            new Triship(15, 1000, 210, false, 4, 4, "zigzag", 400, 600),
            new Triship(15, 1000, 410, true, 4, -4, "zigzag", 400, 600),
            new Triship(15, 1160, 210, true, 4, 4, "zigzag", 400, 600),
            new Triship(15, 1160, 410, false, 4, -4, "zigzag", 400, 600)
        ]
    },
    {
        time: 22000,
        object: [new Beetle(15, 840, 420, true, 3, 0, "linear", 0, 0)]
    },
    {
        time: 25000,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 25400,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 25800,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 26200,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 26600,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 27000,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 28000,
        object: [new Flipper(25, 840, 320, true, 3, 0.06, "wave", 100, 320)]
    },
    {
        time: 28700,
        object: [new Flipper(25, 840, 320, true, 3, 0.06, "wave", 100, 320)]
    },
    {
        time: 29400,
        object: [new Flipper(25, 840, 320, true, 3, 0.06, "wave", 100, 320)]
    },
    {
        time: 30100,
        object: [new Flipper(25, 840, 320, true, 3, 0.06, "wave", 100, 320)]
    },
    {
        time: 32300,
        object: [
            new Dragonfly(15, 840, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 840, 430, true, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1000, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1000, 430, true, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1160, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1160, 430, true, 3.5, -3, "zigzag", 350, 600)
        ]
    },
    {
        time: 37000,
        object: [new PowerUp(840, 200, 4, 0, "linear", 0, 0)]
    },
    {
        time: 40000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 50, 200)]
    },
    {
        time: 43000,
        object: [
            new Squid(15, 840, 210, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 1140, 210, true, 4, 2, "zigzag", 300, 700)
        ]
    },
    {
        time: 48000,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 48400,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 48800,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 49200,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 49600,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 51000,
        object: [
            new Dragonfly(15, 840, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 840, 430, true, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1000, 210, false, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1000, 430, false, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1160, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1160, 430, false, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1320, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1320, 430, false, 3.5, -3, "zigzag", 350, 600)
        ]
    },
    {
        time: 57000,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 57500,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 58000,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 58500,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 59000,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 59500,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 60000,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 60500,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 61000,
        object: [new Boss6()]  //boss
    },
    {
        time: 65000,
        object: []    // bg stop trigger
    }
];
isLevelDark = false;
const enemiesLvl7 = [
    {
        time: 2000,
        object: [
            new Kraken(25, 840, 100, true, 3, 0.05, "wave", 40, 100),
            new Kraken(25, 840, 320, true, 5, 0.06, "wave", 40, 320)
        ]
    },
    {
        time: 2500,
        object: [
            new Kraken(25, 900, 100, true, 3, 0.05, "wave", 40, 100),
            new Kraken(25, 840, 320, true, 5, 0.06, "wave", 40, 320)
        ]
    },
    {
        time: 6000,
        object: [
            new Kraken(25, 840, 150, true, 5, 0.06, "wave", 40, 150),
            new Kraken(25, 840, 320, true, 3, 0.05, "wave", 40, 320)
        ]
    },
    {
        time: 6500,
        object: [
            new Kraken(25, 840, 150, true, 5, 0.06, "wave", 40, 150),
            new Kraken(25, 900, 320, true, 3, 0.05, "wave", 40, 320)
        ]
    },
    {
        time: 9000,
        object: [
            new Kraken(25, 840, 100, true, 5, 0.06, "wave", 40, 100),
            new Kraken(25, 840, 300, true, 3, -3, "zigzag", 400, 650),
            new Kraken(25, 980, 300, true, 3, -3, "zigzag", 400, 650)
        ]
    },
    {
        time: 9500,
        object: [new Kraken(25, 840, 100, true, 5, 0.06, "wave", 40, 100)]
    },
    {
        time: 13000,
        object: [
            new Beetle(15, 840, 180, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 980, 180, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 1120, 180, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 1260, 180, true, 6, 0, "linear", 0, 0)
        ]
    },
    {
        time: 15000,
        object: [
            new Beetle(15, 840, 310, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 980, 310, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 1120, 310, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 1260, 310, true, 6, 0, "linear", 0, 0)
        ]
    },
    {
        time: 16000,
        object: [
            new Beetle(15, 840, 50, true, 5, 4, "zigzag", 300, 600),
            new Beetle(15, 980, 50, true, 5, 4, "zigzag", 300, 600),
            new Beetle(15, 1120, 50, true, 5, 4, "zigzag", 300, 600),
            new Beetle(15, 1260, 50, true, 5, 4, "zigzag", 300, 600),
            new Beetle(15, 1400, 50, true, 5, 4, "zigzag", 300, 600)
        ]
    },
    {
        time: 18500,
        object: [
            new Beetle(15, 840, 180, true, 5, 0, "linear", 0, 0),
            new Beetle(15, 980, 180, true, 5, 0, "linear", 0, 0),
            new Beetle(15, 1120, 180, true, 5, 0, "linear", 0, 0),
            new Beetle(15, 1260, 180, true, 5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 20500,
        object: [
            new Triship(25, 840, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 980, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 1120, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 1260, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 1400, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 1540, 50, true, 2, 1.5, "zigzag", 450, 800)
        ]
    },
    {
        time: 22000,
        object: [
            new Triship(25, 840, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 980, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 1120, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 1260, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 1400, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 1540, 300, true, 4, -4, "zigzag", 350, 600)
        ]
    },
    {
        time: 30500,
        object: [
            new Shuttle(25, 1120, 50, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 980, 120, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 840, 190, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 980, 260, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1120, 330, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 35000,
        object: [
            new Shuttle(25, 1120, 50, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 980, 120, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 840, 190, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 980, 260, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1120, 330, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 40000,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 40700,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 41400,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 42100,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 42800,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 44000,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 44500,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 45000,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 45500,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 46000,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 52000,
        object: [new Boss7()]  //boss
    }
];
const enemiesLvl8 = [
    {
        time: 2000,
        object: [
            new Squid(70, 840, 70, false, 3, 0, "linear", 0, 0),
            new Squid(70, 840, 170, false, 3, 0, "linear", 0, 0),
            new Squid(70, 840, 270, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 4000,
        object: [
            new Dragonfly(25, 840, 50, true, 2, 2, "zigzag", 350, 600),
            new Dragonfly(25, 940, 200, true, 2, 0.04, "wave", 130, 180),
            new Dragonfly(25, 1040, 50, true, 2, 2, "zigzag", 350, 600),
            new Dragonfly(25, 1140, 200, true, 2, 0.06, "wave", 130, 180),
            new Dragonfly(25, 1240, 50, true, 2, 2, "zigzag", 350, 600),
            new Dragonfly(25, 1340, 200, true, 2, 0.03, "wave", 130, 180),
            new Dragonfly(25, 1440, 50, true, 2, 2, "zigzag", 350, 600),
            new Dragonfly(25, 1540, 200, true, 2, 0.05, "wave", 130, 180)
        ]
    },
    {
        time: 12050,
        object: [new Boss8()]
    },
    {
        time: 15700,
        object: []
        // bg stop trigger component so blank object
    }
];

