import React, { useEffect, useState } from "react";
import Phaser from "phaser";
import sky from "./assets/sky.png";
import woof from "./assets/woof.png";
import diamond from "./assets/diamond.png";
import platform from "./assets/platform.png";

function Game() {
    const [score, setScore] = useState(0); // This is the state variable that will store the score

    useEffect(() => {
        // This is the useEffect hook that will run the game
        let game;
        let player;
        let diamonds;
        let cursors;
        let scoreText;
        let platforms;

        const config = {
            // This is the configuration object for the game
            type: Phaser.AUTO, // 喧染環境 (WebGL, Canvas, or Auto)
            width: 800, // width of the game
            height: 600, // height of the game
            parent: "game-container", // parent container of the game, phaser will append the canvas to this container
            physics: {
                default: "arcade", // physics engine to use
                arcade: { gravity: { y: 300 }, debug: false }, // configuration for the arcade physics engine
            },
            scene: {
                preload: function () {
                    this.load.image("sky", sky); // This is the background image of the game
                    this.load.image("platform", platform); // This is the platform image
                    this.load.image("diamond", diamond); // This is the diamond image
                    this.load.spritesheet("dude", woof, {
                        // This is the sprite sheet for the player, it will makes the player look like it is walking
                        frameWidth: 32,
                        frameHeight: 32,
                    });
                },

                create: function () {
                    this.add.image(400, 300, "sky"); //
                    player = this.physics.add.sprite(400, 530, "dude");

                    // ensure the player and platforms do not fall out of the screen
                    platforms = this.physics.add.staticGroup();
                    platforms
                        .create(400, 580, "platform")
                        .setScale(2)
                        .refreshBody(); // refreshBody() is used to update the body of the platform
                    platforms.create(600, 400, "platform");
                    platforms.create(50, 250, "platform");

                    // this.physics.add.collider(diamonds, player);
                    this.physics.add.collider(player, platforms);
                    player.setCollideWorldBounds(true); // This will make the player collide with the world bounds

                    this.anims.create({
                        key: "left",
                        frames: this.anims.generateFrameNumbers("dude", {
                            // This will generate the frame numbers for the animation
                            start: 0,
                            end: 1,
                        }),
                        frameRate: 10, // This is the frame rate of the animation, 10 frames per second
                        repeat: -1,
                    });

                    this.anims.create({
                        key: "turn",
                        frames: [{ key: "dude", frame: 2 }],
                        frameRate: 20,
                    });

                    this.anims.create({
                        key: "right",
                        frames: this.anims.generateFrameNumbers("dude", {
                            start: 2,
                            end: 3,
                        }),
                        frameRate: 10,
                        repeat: -1,
                    });

                    diamonds = this.physics.add.group({
                        // This is the group of diamonds
                        key: "diamond",
                        repeat: 5,
                        setXY: { x: 100, y: 0, stepX: 150 }, // This will set the x and y position of the diamonds, and the stepX will set the distance between the diamonds
                    });

                    // diamonds.children.iterate((diamond) => {
                    //     // This will iterate over each diamond in the group
                    //     diamond.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // This will set the bounce of the diamond
                    // });

                    // let the diamonds keep  falling down

                    this.physics.add.collider(
                        player,
                        diamonds,
                        collectDiamond,
                        null,
                        this
                    );

                    this.time.addEvent({
                        delay: 1000, // 每 1000 毫秒（1 秒）
                        callback: this.spawnDiamond, // 執行 spawnDiamond 函數
                        callbackScope: this,
                        loop: true, // 讓計時器一直執行
                    });

                    cursors = this.input.keyboard.createCursorKeys();

                    scoreText = this.add.text(16, 16, "Score: 0", {
                        fontSize: "32px",
                        fill: "#fff",
                    });
                },

                spawnDiamond: function () {
                    // 在隨機 x 位置生成鑽石
                    let x = Phaser.Math.Between(50, 750);
                    let diamond = diamonds.create(x, 0, "diamond");

                    // 設置重力效果，讓鑽石掉落
                    diamond.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
                    // diamond.setVelocityY(100); // 確保鑽石掉落速度是固定的
                    diamond.setCollideWorldBounds(false);
                },

                update: function () {
                    if (cursors.left.isDown) {
                        player.setVelocityX(-160);
                        player.anims.play("left", true);
                    } else if (cursors.right.isDown) {
                        player.setVelocityX(160);
                        player.anims.play("right", true);
                    } else {
                        player.setVelocityX(0);
                        player.anims.play("turn");
                    }

                    if (cursors.up.isDown && player.body.touching.down) {
                        player.setVelocityY(-330);
                    }

                    // 檢查鑽石是否超出邊界，如果超出邊界則重新生成鑽石
                    diamonds.children.iterate((diamond) => {
                        if (diamond.y > 600) {
                            diamond.setPosition(
                                Phaser.Math.Between(50, 750),
                                0
                            );
                            diamond.setVelocityY(100);
                        }
                    });
                },
            },
        };

        function collectDiamond(player, diamond) {
            diamond.disableBody(true, true);
            setScore((score) => {
                scoreText.setText("Score: " + (score + 10));
                return score + 10;
            });
        }

        game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);
    return (
        <div>
            <div id='game-container'></div>
        </div>
    );
}

export default Game;
