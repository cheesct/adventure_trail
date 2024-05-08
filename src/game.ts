import * as Phaser from 'phaser'
import Scene_Menu from './Scene_Menu'
import Scene_Level1 from './Scene_Level1'
import Scene_Level1b from './Scene_Level1b'
import Scene_Level1c from './Scene_Level1c'
import Scene_Level1d from './Scene_Level1d'
import Scene_Level1e from './Scene_Level1e'
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
		this.load.spritesheet('key', 'assets/key.png', { frameWidth: 13, frameHeight: 28 })
	    this.load.spritesheet('bee', 'assets/bee.png', { frameWidth: 29, frameHeight: 30 })
	    this.load.spritesheet('door', 'assets/door.png', { frameWidth: 12, frameHeight: 36 })
	    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 50, frameHeight: 37 })
		this.load.spritesheet('frog', 'assets/frog.png', { frameWidth: 35, frameHeight: 32 })
	    this.load.spritesheet('slime', 'assets/slime.png', { frameWidth: 32, frameHeight: 25 })
	    this.load.spritesheet('cherry', 'assets/cherry.png', { frameWidth: 19, frameHeight: 16 })
		this.load.spritesheet('firepit', 'assets/firepit.png', { frameWidth: 32, frameHeight: 32 })
	    this.load.spritesheet('fx_item', 'assets/fx_item.png', { frameWidth: 32, frameHeight: 32 })
	    this.load.spritesheet('fx_ring', 'assets/fx_ring.png', { frameWidth: 192, frameHeight: 192 })
	    this.load.spritesheet('fx_slash', 'assets/fx_slash.png', { frameWidth: 96, frameHeight: 96 })
		this.load.spritesheet('fx_attack', 'assets/fx_attack.png', { frameWidth: 192, frameHeight: 192 })
		this.load.spritesheet('fx_dust_run', 'assets/fx_dust_run.png', { frameWidth: 14, frameHeight: 8 })
		this.load.spritesheet('fx_dust_jump', 'assets/fx_dust_jump.png', { frameWidth: 17, frameHeight: 20 })
	    this.load.spritesheet('enemy_death', 'assets/enemy_death.png', { frameWidth: 37, frameHeight: 39 })
	    this.load.spritesheet('bounce_shroom', 'assets/bounce_shroom.png', { frameWidth: 56, frameHeight: 42 })
		this.load.spritesheet('piranha_plant', 'assets/piranha_plant.png', { frameWidth: 61, frameHeight: 35 })
		this.load.spritesheet('piranha_plant2', 'assets/piranha_plant2.png', { frameWidth: 61, frameHeight: 40 })
		this.load.spritesheet('piranha_plant_projectile', 'assets/piranha_plant_projectile.png', { frameWidth: 16, frameHeight: 8 })
		this.load.spritesheet('piranha_plant_projectile_blast', 'assets/piranha_plant_projectile_blast.png', { frameWidth: 16, frameHeight: 16 })
	    this.load.spritesheet('hp_bar', 'assets/hp_bar.png', { frameWidth: 71, frameHeight: 16 })
		this.load.spritesheet('popup_notice', 'assets/popup_notice.png', { frameWidth: 18, frameHeight: 18 })
	    this.load.spritesheet('level2_lava', 'assets/level2/lava.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('level2_water', 'assets/level2/water.png', { frameWidth: 32, frameHeight: 32 })
		this.load.spritesheet('level2_waterfall', 'assets/level2/waterfall.png', { frameWidth: 16, frameHeight: 16 })

	    this.load.atlas('flares', 'assets/fx_flares.png', 'assets/fx_flares.json')

		this.load.audio('snd_jump', 'assets/audio/jump.mp3')
		this.load.audio('snd_slap', 'assets/audio/slap.ogg')
		this.load.audio('snd_dead', 'assets/audio/dead.mp3')
		this.load.audio('snd_slide', 'assets/audio/slide.mp3')
		this.load.audio('snd_bounce', 'assets/audio/bounce.ogg')
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
		this.load.audio('mus_level1', 'assets/audio/level1.mp3')
		this.load.audio('mus_level2', 'assets/audio/level2.mp3')

        this.load.image('logo', 'assets/phaser3-logo.png')
        this.load.image('libs', 'assets/libs.png')
        this.load.glsl('starfield', 'assets/starfield.glsl.js')
		this.load.glsl('transition_diamond', 'assets/transition_diamond.glsl.js')
		this.load.glsl('transition_smooth', 'assets/transition_smooth.glsl.js')
		this.load.bitmapFont('fn_l', 'assets/font/lame_0.png', 'assets/font/lame.fnt')
		this.load.bitmapFont('fn_l_g', 'assets/font/l_glow_0.png', 'assets/font/l_glow.fnt')
		this.load.bitmapFont('fn_l_h', 'assets/font/l_hard_0.png', 'assets/font/l_hard.fnt')
		this.load.bitmapFont('fn_b', 'assets/font/bold_0.png', 'assets/font/bold.fnt')
		this.load.bitmapFont('fn_b_g', 'assets/font/b_glow_0.png', 'assets/font/b_glow.fnt')
		this.load.bitmapFont('fn_b_h', 'assets/font/b_hard_0.png', 'assets/font/b_hard.fnt')
		this.load.bitmapFont('fn_i', 'assets/font/italic_0.png', 'assets/font/italic.fnt')
		this.load.bitmapFont('fn_i_g', 'assets/font/i_glow_0.png', 'assets/font/i_glow.fnt')
		this.load.bitmapFont('fn_i_h', 'assets/font/i_hard_0.png', 'assets/font/i_hard.fnt')
		this.load.bitmapFont('fn_bi', 'assets/font/bold_italic_0.png', 'assets/font/bold_italic.fnt')
		this.load.bitmapFont('fn_bi_g', 'assets/font/bi_glow_0.png', 'assets/font/bi_glow.fnt')
		this.load.bitmapFont('fn_bi_h', 'assets/font/bi_hard_0.png', 'assets/font/bi_hard.fnt')
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
		this.anims.create({ key: 'fx_dust_run', frames: this.anims.generateFrameNumbers('fx_dust_run', { start: 0, end: 4 }), duration: 300, })
		this.anims.create({ key: 'fx_dust_jump', frames: this.anims.generateFrameNumbers('fx_dust_jump', { start: 0, end: 5 }), duration: 360, })

	    //enemy animations
		this.anims.create({ key: 'bee', frames: this.anims.generateFrameNumbers('bee', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })

		this.anims.create({ key: 'frog_sit', frames: this.anims.generateFrameNumbers('frog', { frames: [ 0 ] }), duration: 100 })
		this.anims.create({ key: 'frog_idle', frames: this.anims.generateFrameNumbers('frog', { frames: [ 0, 0, 1, 2, 3, 0, 0 ] }), duration: 1000 })
		this.anims.create({ key: 'frog_jump', frames: this.anims.generateFrameNumbers('frog', { frames: [ 4 ] }), duration: 2000 })
		this.anims.create({ key: 'frog_fall', frames: this.anims.generateFrameNumbers('frog', { frames: [ 5 ] }), duration: 2000 })

		this.anims.create({ key: 'slime_idle', frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 3 }), frameRate: 10, repeat: -1 })
		this.anims.create({ key: 'slime_move', frames: this.anims.generateFrameNumbers('slime', { start: 4, end: 7 }), frameRate: 10, repeat: -1 })
		this.anims.create({ key: 'slime_hurt', frames: this.anims.generateFrameNumbers('slime', { start: 13, end: 16 }), duration: 300, })
		this.anims.create({ key: 'slime_death', frames: this.anims.generateFrameNumbers('slime', { start: 17, end: 20 }), frameRate: 8, })
	    this.anims.create({ key: 'slime_attack', frames: this.anims.generateFrameNumbers('slime', { start: 8, end: 12 }), frameRate: 10, })
		
		this.anims.create({ key: 'piranha_plant_idle', frames: this.anims.generateFrameNumbers('piranha_plant', { start: 0, end: 4 }), frameRate: 10, repeat: -1 })
		this.anims.create({ key: 'piranha_plant_attack', frames: this.anims.generateFrameNumbers('piranha_plant', { frames: [ 6 ] }), duration: 200 })
		this.anims.create({ key: 'piranha_plant_warning', frames: this.anims.generateFrameNumbers('piranha_plant', { frames: [ 5 ] }), duration: 300 })
		this.anims.create({ key: 'piranha_plant2_idle', frames: this.anims.generateFrameNumbers('piranha_plant2', { start: 0, end: 4 }), frameRate: 10, repeat: -1 })
		this.anims.create({ key: 'piranha_plant2_attack', frames: this.anims.generateFrameNumbers('piranha_plant2', { frames: [ 6 ] }), duration: 200 })
		this.anims.create({ key: 'piranha_plant2_warning', frames: this.anims.generateFrameNumbers('piranha_plant2', { frames: [ 5 ] }), duration: 300 })
		this.anims.create({ key: 'piranha_plant_projectile', frames: this.anims.generateFrameNumbers('piranha_plant_projectile', { start: 0, end: 7 } ), duration: 800, repeat: -1 })
		this.anims.create({ key: 'piranha_plant_projectile_blast', frames: this.anims.generateFrameNumbers('piranha_plant_projectile_blast', { start: 0, end: 3 } ), duration: 300, })

	    this.anims.create({ key: 'enemy_death', frames: this.anims.generateFrameNumbers('enemy_death', { start: 0, end: 5 }), frameRate: 10 })
		
	    //
		this.anims.create({ key: 'key', frames: this.anims.generateFrameNumbers('key', { start: 0, end: 11 }), frameRate: 10, repeat: -1 })
	    this.anims.create({ key: 'cherry', frames: this.anims.generateFrameNumbers('cherry', { start: 0, end: 4 }), frameRate: 10, yoyo: true, repeat: -1 })
		this.anims.create({ key: 'firepit', frames: this.anims.generateFrameNumbers('firepit', { start: 0, end: 7 }), duration: 800, repeat: -1  })
		this.anims.create({ key: 'door', frames: this.anims.generateFrameNumbers('door', { start: 0, end: 4 }), frameRate: 10 })
		this.anims.create({ key: 'door_close', frames: this.anims.generateFrameNumbers('door', { start: 4, end: 0 }), frameRate: 10 })
		this.anims.create({ key: 'bounce_shroom', frames: this.anims.generateFrameNumbers('bounce_shroom', { start: 0, end: 7 }), duration: 500 })

		//level graphics
		this.anims.create({ key: 'level2_lava', frames: this.anims.generateFrameNumbers('level2_lava', { start: 0, end: 2 }), repeat: -1, frameRate: 8 })
		this.anims.create({ key: 'level2_water', frames: this.anims.generateFrameNumbers('level2_water', { start: 0, end: 2 }), repeat: -1, frameRate: 8 })
		this.anims.create({ key: 'level2_waterfall', frames: this.anims.generateFrameNumbers('level2_waterfall', { start: 0, end: 2 }), repeat: -1, frameRate: 8 })
		//game.plugins.install()
	}
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    zoom: 1,
	width: 320,
	height: 160,
	pixelArt: true,	//else tiles would break
	antialias: false,
	roundPixels: false,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { x: 0, y: 500 },
			debug: false,
		}
	},
    scene: [ 
		Demo,
		Scene_Menu,
		Scene_Level1,
		Scene_Level1b,
		Scene_Level1c,
		Scene_Level1d,
		Scene_Level1e,
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
