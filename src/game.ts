import * as Phaser from 'phaser'
import Scene_Menu from './Scene_Menu'
import Scene_Level1 from './Scene_Level1'
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
	    this.load.spritesheet('hero', 'assets/adventurer.png', { frameWidth: 50, frameHeight: 37 })
	    this.load.spritesheet('hp_bar', 'assets/hp_bar.png', { frameWidth: 71, frameHeight: 16 })
		
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

        //Piranha Plant
    	this.anims.create({ key: 'piranha_plant_idle', frames: this.anims.generateFrameNumbers('piranha_plant', { start: 0, end: 4 }), frameRate: 10, repeat: -1 })
	    this.anims.create({ key: 'piranha_plant_attack', frames: this.anims.generateFrameNumbers('piranha_plant', { start: 5, end: 8 }), frameRate: 10, })

	    //
	    this.anims.create({ key: 'cherry', frames: this.anims.generateFrameNumbers('cherry', { start: 0, end: 4 }), frameRate: 10, yoyo: true, repeat: -1 })
		this.anims.create({ key: 'key', frames: this.anims.generateFrameNumbers('key', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })
	    this.anims.create({ key: 'bee', frames: this.anims.generateFrameNumbers('bee', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })
		this.anims.create({ key: 'door', frames: this.anims.generateFrameNumbers('door', { start: 0, end: 4 }), frameRate: 10 })
	}
}

//slide
//https://home.cs.colorado.edu/~kena/classes/5448/f12/presentation-materials/udayashankar.pdf   EN
//https://ssyu.im.ncnu.edu.tw/course/CSDB/chap8.pdf   EN
//https://www.cs.jhu.edu/~yarowsky/cs415slides/17-oodbs.pdf   EN
//https://slideplayer.com/slide/14354406/
//https://www.slideshare.net/anhhuycan83/slide-cosodulieuchuong8csdlhuongdoituong
//https://cuuduongthancong.com/pvf/166738/co-so-du-lieu-phan-tan-va-huong-doi-tuong//co-so-du-lieu-nang-cao.pdf?src=thumb
//

//article - intro
//https://www.cs.uct.ac.za/mit_notes/database/pdfs/chp16.pdf  EN

//article - research
//https://hueuni.edu.vn/portal/data/doc/tapchi/48.pdf
//https://dthujs.vn/index.php/dthujs/article/view/1202/1096?lang=en_US
//https://sti.vista.gov.vn/file_DuLieu/dataTLKHCN//Vd331-2008/2004/Vd331-2008S002004305.pdf

//luan van
//https://luanvan.net.vn/luan-van/co-so-du-lieu-huong-doi-tuong-thoi-gian-va-xu-ly-truy-van-trong-co-so-du-lieu-huong-doi-tuong-thoi-gian-51597/
//http://luanan.nlv.gov.vn/luanan?a=d&d=TTbGLiazQydu2007.1.24&e=-------vi-20--1--img-txIN-------
//https://xemtailieu.net/tai-lieu/co-so-du-lieu-huong-doi-tuong-1345203.html
//https://123docz.net/document/13361077-ebook-co-so-du-lieu-huong-doi-tuong-hoang-bao-hung.htm
//https://123docz.net/document/1391623-co-so-du-lieu-huong-doi-tuong.htm

//https://www.tutorialride.com/object-based-databases/object-based-databases-tutorial.htm
//https://fit.lqdtu.edu.vn/files/FileMonHoc/1250588_CoSoDuLIeuHuongDoiTuong.pdf


const config = {
    type: Phaser.WEBGL,
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
		},
		matter: {
			gravity: { y: 8 },
			debug: false,
		}
	},
    scene: [ 
		Demo,
		Scene_Menu,
		Scene_Level1,
		Scene_Level2,
	],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    }
}

const game = new Phaser.Game(config)
