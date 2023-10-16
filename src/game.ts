import * as Phaser from 'phaser'
import Scene_Menu from './Scene_Menu'
import Scene_Level1 from './Scene_Level1'
import Scene_Level1b from './Scene_Level1b'
import Scene_Level2 from './Scene_Level2'

export default class Demo extends Phaser.Scene
{
    constructor ()
    {
        super('demo')
    }

    preload ()
    {
        this.load.image('trigger', 'assets/trigger.png')
		this.load.image('star', 'assets/star.png')
	    this.load.spritesheet('key', 'assets/key.png', { frameWidth: 9, frameHeight: 18 })
	    this.load.spritesheet('bee', 'assets/bee.png', { frameWidth: 29, frameHeight: 30 })
	    this.load.spritesheet('door', 'assets/door.png', { frameWidth: 12, frameHeight: 36 })
	    this.load.spritesheet('slime', 'assets/slime.png', { frameWidth: 32, frameHeight: 25 })
	    this.load.spritesheet('cherry', 'assets/cherry.png', { frameWidth: 19, frameHeight: 16 })
	    this.load.spritesheet('hero', 'assets/adventurer.png', { frameWidth: 50, frameHeight: 37 })
	    this.load.spritesheet('fx_item', 'assets/fx_item.png', { frameWidth: 32, frameHeight: 32 })
	    this.load.spritesheet('fx_ring', 'assets/fx_ring.png', { frameWidth: 192, frameHeight: 192 })
	    this.load.spritesheet('fx_slash', 'assets/fx_slash.png', { frameWidth: 96, frameHeight: 96 })
		this.load.spritesheet('fx_attack', 'assets/fx_attack.png', { frameWidth: 192, frameHeight: 192 })
	    this.load.spritesheet('enemy_death', 'assets/enemy_death.png', { frameWidth: 37, frameHeight: 39 })
	    this.load.spritesheet('bounceshroom', 'assets/bounceshroom.png', { frameWidth: 56, frameHeight: 42 })
	    this.load.spritesheet('hp_bar', 'assets/hp_bar.png', { frameWidth: 71, frameHeight: 16 })
	    this.load.spritesheet('level2_lava', 'assets/level2/lava.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('level2_water', 'assets/level2/water.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('level2_waterfall', 'assets/level2/waterfall.png', { frameWidth: 16, frameHeight: 16 })

	    this.load.atlas('flares', 'assets/fx_flares.png', 'assets/fx_flares.json')

		this.load.audio('snd_jump', 'assets/audio/jump.mp3')
		this.load.audio('snd_hurt', 'assets/audio/hurt.mp3')
		this.load.audio('snd_dead', 'assets/audio/dead.mp3')
		this.load.audio('snd_slide', 'assets/audio/slide.mp3')
		this.load.audio('snd_key', 'assets/audio/key.mp3')
		this.load.audio('snd_food', 'assets/audio/food.mp3')
		this.load.audio('snd_door', 'assets/audio/door.mp3')
		this.load.audio('snd_pickup', 'assets/audio/itemize.mp3')
		this.load.audio('snd_sword_slash', 'assets/audio/sword_woosh.mp3')
		this.load.audio('snd_sword_hit', 'assets/audio/sword_hit.mp3')
		this.load.audio('snd_slime_splat', 'assets/audio/slime_splat.mp3')
		this.load.audio('snd_slime_death', 'assets/audio/slime_death.mp3')
		this.load.audio('snd_insect_death', 'assets/audio/insect_death.mp3')
		this.load.audio('snd_menu_switch', 'assets/audio/menu_switch.mp3')
		this.load.audio('snd_menu_select', 'assets/audio/menu_select.mp3')
		this.load.audio('mus_menu', 'assets/audio/Title.mp3')
		this.load.audio('mus_level1', 'assets/audio/Forest Drama.mp3')
		this.load.audio('mus_level2', 'assets/audio/Wicked Dreams.mp3')

        this.load.image('logo', 'assets/phaser3-logo.png')
        this.load.image('libs', 'assets/libs.png')
        this.load.glsl('starfield', 'assets/starfield.glsl.js')
		this.load.glsl('transition_diamond', 'assets/transition_diamond.glsl.js')
		this.load.glsl('transition_smooth', 'assets/transition_smooth.glsl.js')

        this.load.on("progress", (percent) => { this.add.graphics({ fillStyle: { color: 0xffffff }}).fillRect(0, this.cameras.main.height / 2 - 10, this.cameras.main.width * percent, 20) })
		this.load.on("complete", () => { this.scene.start("Scene_Menu") })
	}

    create() 
    {
	    //player animation
	    this.anims.create({ key: 'hero_walk', frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 13 }), repeat: -1, frameRate: 10, })
	    this.anims.create({ key: 'hero_idle', frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }), repeat: -1, frameRate: 7, })
	    this.anims.create({ key: 'hero_idle2', frames: this.anims.generateFrameNumbers('hero', { start: 38, end: 41 }), repeat: -1, frameRate: 7, })
	    this.anims.create({ key: 'hero_boost', frames: this.anims.generateFrameNumbers('hero', { start: 17, end: 21 }), frameRate: 20, repeat: 1})
	    this.anims.create({ key: 'hero_up', frames: this.anims.generateFrameNumbers('hero', { start: 77, end: 78 }), repeat: -1, frameRate: 8, })
	    this.anims.create({ key: 'hero_fall', frames: this.anims.generateFrameNumbers('hero', { start: 22, end: 23 }), repeat: -1, frameRate: 8, })
	    this.anims.create({ key: 'hero_unsealth_sword', frames: this.anims.generateFrameNumbers('hero', { start: 69, end: 73 }), frameRate: 20, })
	    this.anims.create({ key: 'hero_attack_1_1', frames: this.anims.generateFrameNumbers('hero', { start: 42, end: 43 }), duration: 125, })
	    this.anims.create({ key: 'hero_attack_1_2', frames: this.anims.generateFrameNumbers('hero', { start: 44, end: 47 }), duration: 250, })
	    this.anims.create({ key: 'hero_attack_2_1', frames: this.anims.generateFrameNumbers('hero', { start: 47, end: 49 }), duration: 200, })
	    this.anims.create({ key: 'hero_attack_2_2', frames: this.anims.generateFrameNumbers('hero', { start: 50, end: 52 }), duration: 200, })
	    this.anims.create({ key: 'hero_attack_3_1', frames: this.anims.generateFrameNumbers('hero', { start: 53, end: 54 }), duration: 150, })
	    this.anims.create({ key: 'hero_attack_3_2', frames: this.anims.generateFrameNumbers('hero', { start: 55, end: 58 }), duration: 250, })
	    this.anims.create({ key: 'hero_attack_air', frames: this.anims.generateFrameNumbers('hero', { start: 96, end: 99 }), duration: 350, })
		this.anims.create({ key: 'hero_attack_air_2', frames: this.anims.generateFrameNumbers('hero', { start: 100, end: 102 }), duration: 250, })
	    this.anims.create({ key: 'hero_attack_air_down_prep', frames: this.anims.generateFrameNumbers('hero', { start: 102, end: 103 }), duration: 200, })
		this.anims.create({ key: 'hero_attack_air_down_loop', frames: this.anims.generateFrameNumbers('hero', { start: 104, end: 105 }), frameRate: 24, })
		this.anims.create({ key: 'hero_attack_air_down_land', frames: this.anims.generateFrameNumbers('hero', { start: 106, end: 108 }), duration: 300, })
		this.anims.create({ key: 'hero_attack_rise', frames: this.anims.generateFrameNumbers('hero', { start: 100, end: 102 }), duration: 300, })
		this.anims.create({ key: 'hero_slide', frames: this.anims.generateFrameNumbers('hero', { start: 24, end: 26 }), frameRate: 15, })
	    this.anims.create({ key: 'hero_slide_recover', frames: this.anims.generateFrameNumbers('hero', { start: 27, end: 28 }), duration: 200, })
		this.anims.create({ key: 'hero_hurt', frames: this.anims.generateFrameNumbers('hero', { start: 59, end: 61 }), frameRate: 5, })
	    this.anims.create({ key: 'hero_defeat', frames: this.anims.generateFrameNumbers('hero', { start: 62, end: 68 }), frameRate: 8, })
	    
	    //effect animation
	    this.anims.create({ key: 'fx_item', frames: this.anims.generateFrameNumbers('fx_item', { start: 0, end: 3 }), frameRate: 10 })
	    this.anims.create({ key: 'fx_ring', frames: this.anims.generateFrameNumbers('fx_ring', { start: 0, end: 19 }), duration: 250, })
	    this.anims.create({ key: 'fx_attack', frames: this.anims.generateFrameNumbers('fx_attack', { start: 0, end: 3 }), duration: 125, })

	    //Slime animations
	    this.anims.create({ key: 'slime_idle', frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 3 }), frameRate: 10, repeat: -1 })
	    this.anims.create({ key: 'slime_move', frames: this.anims.generateFrameNumbers('slime', { start: 4, end: 7 }), frameRate: 10, repeat: -1 })
	    this.anims.create({ key: 'slime_attack', frames: this.anims.generateFrameNumbers('slime', { start: 8, end: 12 }), frameRate: 10, })
	    this.anims.create({ key: 'slime_hurt', frames: this.anims.generateFrameNumbers('slime', { start: 13, end: 16 }), duration: 300, })
		this.anims.create({ key: 'slime_death', frames: this.anims.generateFrameNumbers('slime', { start: 17, end: 20 }), frameRate: 8, })
		
	    this.anims.create({ key: 'enemy_death', frames: this.anims.generateFrameNumbers('enemy_death', { start: 0, end: 5 }), frameRate: 10 })
		
	    //
	    this.anims.create({ key: 'cherry', frames: this.anims.generateFrameNumbers('cherry', { start: 0, end: 4 }), frameRate: 10, yoyo: true, repeat: -1 })
		this.anims.create({ key: 'key', frames: this.anims.generateFrameNumbers('key', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })
	    this.anims.create({ key: 'bee', frames: this.anims.generateFrameNumbers('bee', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })
		this.anims.create({ key: 'door', frames: this.anims.generateFrameNumbers('door', { start: 0, end: 4 }), frameRate: 10 })
		this.anims.create({ key: 'door_close', frames: this.anims.generateFrameNumbers('door', { start: 4, end: 0 }), frameRate: 10 })
		this.anims.create({ key: 'bounceshroom', frames: this.anims.generateFrameNumbers('bounceshroom', { start: 0, end: 7 }), duration: 600 })

		//level graphics
		this.anims.create({ key: 'level2_lava', frames: this.anims.generateFrameNumbers('level2_lava', { start: 0, end: 2 }), repeat: -1, frameRate: 8 })
		this.anims.create({ key: 'level2_water', frames: this.anims.generateFrameNumbers('level2_water', { start: 0, end: 2 }), repeat: -1, frameRate: 8 })
		this.anims.create({ key: 'level2_waterfall', frames: this.anims.generateFrameNumbers('level2_waterfall', { start: 0, end: 2 }), repeat: -1, frameRate: 8 })
	}
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    zoom: 1,
	width: 320,
	height: 160,
	pixelArt: true,
	antialias: false,
	roundPixels: false,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 500 },
			debug: true,
		}
	},
    scene: [ 
		Demo,
		Scene_Menu,
		Scene_Level1,
		Scene_Level1b,
		Scene_Level2,
	],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
	callbacks: {
		preBoot: function (game) {
			// @ts-ignore
			game.music = Phaser.Sound.SoundManagerCreator.create(game);
		}
	}
}

const game = new Phaser.Game(config)
