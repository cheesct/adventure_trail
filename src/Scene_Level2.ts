import * as Phaser from 'phaser'
import Helper from './helper'
import Singleton from './singleton'
import Waypoint from './O_Waypoint'
import { Door } from './O_Doors'
import { Player } from './O_Players'
import { Bee, Slime } from './O_Enemies'
import { Key, Cherry } from './O_Pickups'
import { ParallaxScrollingImage, ParallaxStaticTileSprite } from './O_ParallaxComponents'

export default class Scene_Level2 extends Phaser.Scene
{
	private Doors: Phaser.GameObjects.Group
	private Items: Phaser.GameObjects.Group
	private Enemies: Phaser.GameObjects.Group
	private Waypoints: Phaser.GameObjects.Group
	private player: Player
	private transition: Phaser.GameObjects.Shader

    private lighting: any
    private darkness: any

	constructor() 
	{
    	super({ key: "Scene_Level2" })
  	}

  	preload() 
  	{
	    this.load.image('level2_props', 'assets/level2/props.png')
	    this.load.image('level2_tiles', 'assets/level2/tiles.png')
	    this.load.tilemapTiledJSON('level2', 'assets/level2/map2.json')
  	}

  	create() 
  	{
		this.sound.stopAll()
		this.sound.play('mus_level2', { loop: true, volume: 0.8 })

		this.Waypoints = this.add.group()

	    const map = this.make.tilemap({key: "level2"})

        const tile_props = map.addTilesetImage("props", "level2_props")
	    const tile_environment = map.addTilesetImage("environment", "level2_tiles")

		map.createLayer("Background", tile_props, 0, 0)

        for(let i = 8; i <= 136; i += 16)
			this.add.sprite(176, i, 'level2_waterfall').anims.play('level2_waterfall')

        let walls_layer = map.createLayer("Walls", tile_environment, 0, 0).setCollisionByExclusion([-1])
		let spike_layer = map.createLayer("Spike", tile_environment, 0, 0).setCollisionBetween(119, 121)
	    let ai_layer = map.createLayer("Enemy trigger", map.addTilesetImage("trigger", "trigger"), 0, 0).setCollisionByExclusion([-1]).setVisible(this.game.config.physics.arcade.debug)
	    let slide_lock_layer = map.createLayer("Slide lock", map.addTilesetImage("trigger", "trigger"), 0, 0).setCollisionByExclusion([-1]).setVisible(this.game.config.physics.arcade.debug)
		map.createLayer("Props", tile_environment, 0, 0);

	    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
	    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, false)

	    this.Items = this.add.group()
	    this.Enemies = this.add.group()

	    map.createFromObjects('Objects', { name : "Cherry", classType: Cherry }).forEach((object) => { this.Items.add(object) })
	    map.createFromObjects('Objects', { name : "Slime", classType: Slime  }).forEach((object) => { this.Enemies.add(object) })
	    map.createFromObjects('Objects', { name : "Bee", classType: Bee  }).forEach((object) => { this.Enemies.add(object) })
	    map.createFromObjects('Objects', { name : "Key", classType: Key  }).forEach((object) => { this.Items.add(object) })
		map.createFromObjects('Objects', { name : "Waypoint", classType: Waypoint }).forEach((object) => { this.Waypoints.add(object) })

	    // The player and its settings
	    this.player = new Player(this, 16, 80)
		//this.player = new Player(this, 1616, 48)
		//this.player = new Player(this, 3456, 64)

        this.add.sprite(160, 144, 'level2_water').anims.play('level2_water')
		this.add.sprite(192, 144, 'level2_water').anims.play('level2_water')
		for(let i = 1488; i <= 1776; i += 32)
			this.add.sprite(i, 144, 'level2_lava').anims.play('level2_lava')

	    const graphics = this.add
	      .graphics()
	      .setAlpha(0.75)
	      .setDepth(20)
	    // worldLayer.renderDebug(graphics, {
	    //   tileColor: null, // Color of non-colliding tiles
	    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
	    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
	    // })

	//  Collision
	    this.physics.add.overlap(this.player.player_attack, this.Enemies, (object, attack) => { this.player.attack_hit(attack, object) })
	    this.physics.add.overlap(this.player, this.Enemies, (player, enemy) => { (player as Player).player_get_hit(enemy) })
	    this.physics.add.overlap(this.player, this.Items, (picker, item) => { (item as Key).pickup(picker) })
		this.physics.add.overlap(this.player, slide_lock_layer, (player, tile) => { (player as Player).slide_lock(tile) })
		this.physics.add.overlap(this.player, spike_layer, (player, tile) => { (player as Player).player_get_spiked(tile) })
		this.physics.add.overlap(this.player, this.Waypoints, (player, waypoint) => { (waypoint as Waypoint).change_scene() })
	    this.physics.add.collider(this.player, walls_layer)
	    this.physics.add.collider(this.player, this.Doors, (player, door) => { (door as Door).open_door(player) })
	    this.physics.add.collider(this.Enemies, ai_layer)
	    this.physics.add.collider(this.Enemies, walls_layer)
	    //this.physics.world.createDebugGraphic()

        this.lighting = this.textures.createCanvas('lights', map.widthInPixels, map.heightInPixels);
	    if(!this.lighting)
	    	this.lighting = this.textures.get('lights');
	    this.darkness = this.add.image(0, 0, "lights").setOrigin(0).setDepth(1);
        this.cameras.main.fadeIn(2000);

		//this.cameras.main.fadeIn(2000)
		const singleton = Singleton.getInstance()
        if (Singleton.transition_name)
        {
            Singleton.sceneTransIn(this)
        }

  	}

  	update(time, delta)
  	{
		delta = delta / 1000
	    this.player.update(delta)
		this.cameras.main.scrollX = Helper.clamp(this.player.x - this.cameras.main.width/2, 0, this.physics.world.bounds.width - this.cameras.main.width)
	    this.Enemies.getChildren().forEach((enemy) => { enemy.update(delta) })
        
	    this.lighting.context.globalCompositeOperation = 'copy';
	    this.lighting.context.fillStyle = '#000000ff';
		const offset = 5
		const filler = offset * 2
    	this.lighting.context.fillRect(this.cameras.main.scrollX - offset, this.cameras.main.scrollY - offset, this.cameras.main.width + filler, this.cameras.main.height + filler);
    	this.lighting.context.globalCompositeOperation = 'destination-out';
		this.lighting.context.fillStyle = '#ffffff88';
		if(this.player.state != "DeathSpike")
		{
			let tau = 2*Math.PI
			let flicker = Phaser.Math.FloatBetween(-1, 1)
			this.lighting.context.beginPath();
			this.lighting.context.arc(this.player.x, this.player.y, 50, 0, tau);
			this.lighting.context.fill();
			this.lighting.context.arc(this.player.x, this.player.y, 70 + flicker * 0.5, 0, tau);
			this.lighting.context.fill();
			this.lighting.context.arc(this.player.x, this.player.y, 80 + flicker, 0, tau);
			this.lighting.context.fill();
		}
		this.lighting.context.fillStyle = '#ffffff11';
		for (let i = 0; i < 15; i++)
		{
			let rand = Phaser.Math.FloatBetween(-1, 1);
			this.lighting.context.fillRect(1472 - i*4 + rand, 0, 336 + 8*i - 2*rand, 160);
		}
    	this.lighting.refresh();
	}
}