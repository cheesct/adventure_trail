import * as Phaser from 'phaser'
import Helper from './helper'
import Singleton from './singleton'
import Waypoint from './O_Waypoint'
import { Door } from './O_Doors'
import { Player } from './O_Players'
import { JumpPad } from './O_JumpPads'
import { Bee, Slime } from './O_Enemies'
import { Key, Cherry } from './O_Pickups'
import { ParallaxScrollingImage, ParallaxStaticTileSprite } from './O_ParallaxComponents'

export default class Scene_Level1_2 extends Phaser.Scene
{
	private Doors: Phaser.GameObjects.Group
	private Items: Phaser.GameObjects.Group
    private Clouds: Phaser.GameObjects.Group
	private Enemies: Phaser.GameObjects.Group
	private JumpPads: Phaser.GameObjects.Group
	private Parallax: Phaser.GameObjects.Group
	private Waypoints: Phaser.GameObjects.Group
	private player: Player
	private transition: Phaser.GameObjects.Shader

	constructor() 
	{
    	super({ key: "Scene_Level1_2" })
  	}

  	preload() 
  	{
	    this.load.image('level1_props', 'assets/level1/props.png')
	    this.load.image('level1_2tiles', 'assets/level1/tiles_1_2.png')
	    this.load.image('sky', 'assets/level1/background.png')
	    this.load.image('grass', 'assets/level1/grass.png')
	    this.load.image('cloud1', 'assets/level1/cloud1.png')
	    this.load.image('cloud2', 'assets/level1/cloud2.png')
	    this.load.image('cloud3', 'assets/level1/cloud3.png')
	    this.load.image('mountains1', 'assets/level1/mountains1.png')
	    this.load.image('mountains2', 'assets/level1/mountains2.png')
	    this.load.tilemapTiledJSON('level1_2', 'assets/level1/map1_2.json')
  	}

  	create() 
  	{
		//this.sound.stopAll()
		//this.sound.play('mus_level1', { loop: true, volume: 0.8 })

		this.Waypoints = this.add.group()
	    this.Parallax = this.add.group()
		this.JumpPads = this.add.group()
	    this.Enemies = this.add.group()
	    this.Clouds = this.add.group()
	    this.Items = this.add.group()
	    this.Doors = this.add.group()

	    this.add.tileSprite(0, 0, 320, 112, "sky").setOrigin(0).setScrollFactor(0)
		this.Parallax.add(new ParallaxStaticTileSprite(this, 0, 82, 320, 32, "mountains2", 0.125))
		this.Parallax.add(new ParallaxStaticTileSprite(this, 0, 88, 320, 32, "mountains1", 0.25))
		this.Parallax.add(new ParallaxStaticTileSprite(this, 0, 112, 320, 64, "grass", 0.5))
	    
	    this.Clouds.add(new ParallaxScrollingImage(this, 160, 4, "cloud1", -3, 100, 420))
	    this.Clouds.add(new ParallaxScrollingImage(this, -20, 20, "cloud2", -6, 100, 420))
	    this.Clouds.add(new ParallaxScrollingImage(this, 40, 20, "cloud2", -6, 100, 420))
		this.Clouds.add(new ParallaxScrollingImage(this, 120, 16, "cloud2", -6, 100, 420))
	    this.Clouds.add(new ParallaxScrollingImage(this, 240, 24, "cloud2", -6, 100, 420))
	    this.Clouds.add(new ParallaxScrollingImage(this, 320, 28, "cloud2", -6, 100, 420))
	    this.Clouds.add(new ParallaxScrollingImage(this, 16, 32, "cloud3", -10, 100, 420))
	    this.Clouds.add(new ParallaxScrollingImage(this, 80, 32, "cloud3", -10, 100, 420))
	    this.Clouds.add(new ParallaxScrollingImage(this, 200, 32, "cloud3", -10, 100, 420))
	    this.Clouds.add(new ParallaxScrollingImage(this, 280, 32, "cloud3", -10, 100, 420))

	    const map = this.make.tilemap({key: "level1_2"})

	    const tile_grassland = map.addTilesetImage("environment", "level1_2tiles")
	    const tile_props = map.addTilesetImage("props", "level1_props")
		const tile_trigger = map.addTilesetImage("trigger", "trigger")

	    map.createLayer("Background", tile_grassland)
	    map.createLayer("Props", tile_props, 0, 2)

	    map.createFromObjects('Objects', { name : "Door" }).forEach((object: Phaser.GameObjects.Sprite) => { this.Doors.add(new Door(this, object.x, object.y, "door")); object.destroy() })
		map.createFromObjects('Objects', { name : "JumpPad" }).forEach((object: Phaser.GameObjects.Sprite) => { this.JumpPads.add(new JumpPad(this, object.x, object.y, object.data.list)); object.destroy() })

	    let ai_layer = map.createLayer("Enemy trigger", tile_trigger).setCollisionByExclusion([-1]).setVisible(this.game.config.physics.arcade.debug)
	    let slide_lock_layer = map.createLayer("Slide lock", tile_trigger).setCollisionByExclusion([-1]).setVisible(this.game.config.physics.arcade.debug)
		
		let platforms_layer = map.createLayer("Platforms", tile_grassland).setCollisionByExclusion([-1])
		let walls_layer = map.createLayer("Walls", tile_grassland).setCollisionByExclusion([-1])

		platforms_layer.forEachTile((tile) => { tile.setCollision(false, false, true, false, false); });

	    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
	    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, false)

	    map.createFromObjects('Objects', { name : "Cherry", classType: Cherry }).forEach((object) => { this.Items.add(object) })
	    map.createFromObjects('Objects', { name : "Slime", classType: Slime  }).forEach((object) => { this.Enemies.add(object) })
	    map.createFromObjects('Objects', { name : "Bee", classType: Bee  }).forEach((object) => { this.Enemies.add(object) })
	    map.createFromObjects('Objects', { name : "Key", classType: Key  }).forEach((object) => { this.Items.add(object) })
		map.createFromObjects('Objects', { name : "Waypoint", classType: Waypoint }).forEach((object) => { this.Waypoints.add(object) })


	    // The player and its settings
	    this.player = new Player(this, 32, 96)
	    //this.player = new Player(this, 1728, 0)
		//this.player = new Player(this, 2768, 112)
		//this.player.setPosition(2768, 112)

	    // const graphics = this.add
	    //   .graphics()
	    //   .setAlpha(0.75)
	    //   .setDepth(20)
		// walls_layer.renderDebug(graphics, {
	    //   tileColor: null, // Color of non-colliding tiles
	    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
	    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
	    // })

	//  Collision
	    this.physics.add.overlap(this.player.player_attack, this.Enemies, (object, attack) => { this.player.attack_hit(attack, object) })
	    this.physics.add.overlap(this.player, this.Enemies, (player, enemy) => { (player as Player).player_get_hit(enemy) })
	    this.physics.add.overlap(this.player, this.Items, (picker, item) => { (item as Key).pickup(picker) })
		this.physics.add.overlap(this.player, slide_lock_layer, (player, tile) => { (player as Player).slide_lock(tile) })
		this.physics.add.overlap(this.player, this.Waypoints, (player, waypoint) => { (waypoint as Waypoint).change_scene() })
		this.physics.add.overlap(this.player, this.JumpPads, (player, pad) => { (player as Player).set_jumpPad(pad) })
	    this.physics.add.collider(this.player, this.Doors, (player, door) => { (door as Door).open_door(player) })
	    this.physics.add.collider(this.player, walls_layer)
		this.physics.add.collider(this.player, platforms_layer)
	    this.physics.add.collider(this.Enemies, ai_layer)
	    this.physics.add.collider(this.Enemies, walls_layer)
	    this.physics.world.createDebugGraphic()

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
	    this.cameras.main.scrollY = Helper.clamp(this.player.y - this.cameras.main.height/2, 0, this.physics.world.bounds.height - this.cameras.main.height)
		this.Clouds.getChildren().forEach((cloud: ParallaxScrollingImage) => { cloud.update(this.cameras.main.scrollX, delta) })
	    this.Enemies.getChildren().forEach((enemy) => { enemy.update(delta) })
	    this.Parallax.getChildren().forEach((parallax: ParallaxStaticTileSprite) => { parallax.update(this.cameras.main.scrollX) })
	}
}