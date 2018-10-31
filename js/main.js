// ----
// Game Sprites
// ----

// HERO
function Mallard(game, x, y) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'mallard');
    
    // anchor
    this.anchor.set(0.5, 0.5);
    // physics properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    // animations
    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [3]);
    // starting animation
    this.animations.play('stop');
}

// inherit from Phaser.Sprite
Mallard.prototype = Object.create(Phaser.Sprite.prototype);
Mallard.prototype.constructor = Mallard;

// moving mallard
Mallard.prototype.move = function (direction) {
    // level freeze
    if (this.isFrozen) { return; }

    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
    
    // update animations and changing direction or mirroring
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Mallard.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down && this.alive && !this.isFrozen;

    if (canJump || this.isBoosting) {
        this.body.velocity.y = -JUMP_SPEED;
        this.isBoosting = true;
    }

    return canJump;
};

Mallard.prototype.stopJumpBoost = function () {
    this.isBoosting = false;
};

Mallard.prototype.freeze = function () {
    this.body.enable = false;
    this.isFrozen = true;
};

Mallard.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};

Mallard.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

Mallard.prototype.die = function () {
    this.alive = false;
    this.body.enable = false;

    this.animations.play('stop').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

// animation method for Mallard
// returns animation name that should be playing depending on current state
Mallard.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation
    
    // dying
    if (!this.alive) {
        name = 'stop';
    }
    
    // frozen and not dying
    else if (this.isFrozen) {
        name = 'stop';
    }
    
    // jumping
    else if (this.body.velocity.y < 0) {
        name = 'jump';
    }

    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    // running
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};

// PAPA PIGEON'S THUGS - ENEMY
function Pigeon(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'pigeon');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Pigeon.SPEED;
}

Pigeon.SPEED = 100;

// inherit from Phaser.Sprite
Pigeon.prototype = Object.create(Phaser.Sprite.prototype);
Pigeon.prototype.constructor = Pigeon;

Pigeon.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Pigeon.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Pigeon.SPEED; // turn right
    }
    
    // change animation and mirror as needed
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Pigeon.prototype.die = function () {
    this.body.enable = false;
    this.kill();
};

// ----
// Loading State
// ----

LoadingState = {};

LoadingState.init = function () {
    // rounds out retro graphics for clearer animations
    this.game.renderer.renderSession.roundPixels = true;
};


LoadingState.preload = function () {
    // load level data
    this.game.load.json('level:0', 'data/level00.json');
    this.game.load.json('level:1', 'data/level01.json');
    
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.spritesheet('mallard', 'images/mallard.png', 42, 60);
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.spritesheet('pigeon', 'images/pigeon.png', 58, 48);
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.image('icon:coin', 'images/coin_icon.png');
    this.game.load.image('font:numbers', 'images/numbers.png');
    this.game.load.spritesheet('door', 'images/door.png', 42, 66);
    this.game.load.image('key', 'images/key.png');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);
    this.game.load.audio('bgm', 'audio/ThePluckedBird.mp3');
};

LoadingState.create = function () {
    this.game.state.start('play', true, false, {level: 0});
};

// ----
// Play State
// ----

PlayState = {};

const LEVEL_COUNT = 2;

PlayState.init = function (data) {
    // initialize key functions
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        space: Phaser.KeyCode.SPACEBAR
    });
    
    // coin count starts at 0
    this.coinPickupCount = 0;
    
    // initialize key state
    this.hasKey = false;
    
    // initialize level
    this.level = (data.level || 0) % LEVEL_COUNT;
};

// create world
PlayState.create = function () {
    // fade in from black
    this.camera.flash('#000000');
    
    // create level entities and decor
    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));
    
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp'),
        key: this.game.add.audio('sfx:key'),
        door: this.game.add.audio('sfx:door')
    };
    this.bgm = this.game.add.audio('bgm');
    this.bgm.loopFull();
    
    // create HUD UI
    this._createHud();
};

PlayState.update = function () {
    // check for collisions and key presses
    this._handleCollisions();
    this._handleInput();
    
    // update HUD info
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.keyIcon.frame = this.hasKey ? 1 : 0;
};

PlayState.shutdown = function () {
    this.bgm.stop();
};

// handling collisions
PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.mallard, this.platforms);
    this.game.physics.arcade.collide(this.pigeons, this.platforms);
    this.game.physics.arcade.collide(this.pigeons, this.enemyWalls);
    
    // mallard vs coin - collects it
    this.game.physics.arcade.overlap(this.mallard, this.coins, this._onMallardVsCoin,
        null, this);
    // mallard vs pigeon - destroys it
    this.game.physics.arcade.overlap(this.mallard, this.pigeons,
        this._onMallardVsEnemy, null, this);
    // mallard vs key - collects it
    this.game.physics.arcade.overlap(this.mallard, this.key, this._onMallardVsKey,
        null, this);
    // mallard vs door - opens it if has key - ends the level
    this.game.physics.arcade.overlap(this.mallard, this.door, this._onMallardVsDoor,
        // ignore if there is no key or the player is on air
        function (mallard, door) {
            return this.hasKey && mallard.body.touching.down;
        }, this);
};

// states for key input
PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move mallard left
        this.mallard.move(-1);
    }
    else if (this.keys.right.isDown) { // move mallard right
        this.mallard.move(1);
    }
    else { // stop
        this.mallard.move(0);
    }
    
    // handle jump
    const JUMP_HOLD = 200; // ms
    if (this.keys.space.downDuration(JUMP_HOLD)) {
        let didJump = this.mallard.jump();
        if (didJump) {
        this.sfx.jump.play();
        }
    else {
        this.mallard.stopJumpBoost();
        }
    }
};

// Actions - Events
PlayState._onMallardVsCoin = function (mallard, coin) {
    this.sfx.coin.play();
    coin.kill();
    this.coinPickupCount++;
};

PlayState._onMallardVsEnemy = function (mallard, enemy) {
    // kill enemies when mallard is falling
    if (mallard.body.velocity.y > 0) {
        enemy.die();
        mallard.bounce();
        this.sfx.stomp.play();
    }
    else { // game over -> restart the game
        mallard.die();
        this.sfx.stomp.play();
        mallard.events.onKilled.addOnce(function () {
            this.game.state.restart(true, false, {level: this.level});
        }, this);
        
        enemy.body.touching = enemy.body.wasTouching;
    }
};

PlayState._onMallardVsKey = function (mallard, key) {
    this.sfx.key.play();
    key.kill();
    this.hasKey = true;
};

PlayState._onMallardVsDoor = function (mallard, door) {
    // change door graphic state
    door.frame = 1;
    this.sfx.door.play();
    
    // play 'enter door' animation and change to next level afterwards
    mallard.freeze();
    this.game.add.tween(mallard)
        .to({x: this.door.x, alpha: 0}, 500, null, true)
        .onComplete.addOnce(this._goToNextLevel, this);
};

PlayState._goToNextLevel = function () {
    this.camera.fade('#000000');
    this.camera.onFadeComplete.addOnce(function () {
        // change to next level
        this.game.state.restart(true, false, {
            level: this.level + 1
        });
    }, this);
};

// load a level
PlayState._loadLevel = function (data) {
    // create all the groups/layers
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.pigeons = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;

    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);

    // spawn mallard and enemies
    this._spawnCharacters({mallard: data.mallard, pigeons: data.pigeons});

    // spawn important objects
    data.coins.forEach(this._spawnCoin, this);
    this._spawnDoor(data.door.x, data.door.y);
    this._spawnKey(data.key.x, data.key.y);

    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);
    // physics for platforms
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    // spawn invisible walls to keep enemies in place
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);

    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

PlayState._spawnCharacters = function (data) {
    // spawn enemies
    data.pigeons.forEach(function (pigeon) {
        let sprite = new Pigeon(this.game, pigeon.x, pigeon.y);
        this.pigeons.add(sprite);
    }, this);
    
    // spawn mallard
    this.mallard = new Mallard(this.game, data.mallard.x, data.mallard.y);
    this.game.add.existing(this.mallard);
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    
    // coin animation
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
    
    //physics to detect overlap with mallard
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};

PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    
    // physics to detect overlap
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;
    
    // continuous tween animation to show key's importance
    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};

// create HUD
PlayState._createHud = function () {
    // key icon
    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);
    // number of coins
    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);
    // coin icon
    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);
    
    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.position.set(10, 10);
    this.hud.add(coinScoreImg);
    this.hud.add(this.keyIcon);
};

// ----
// Entry Point
// ----

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.add('loading', LoadingState);
    game.state.start('loading');
};
