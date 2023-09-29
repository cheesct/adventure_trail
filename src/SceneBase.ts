import * as Phaser from 'phaser'
import Helper from './helper'
import Singleton from './singleton'
import Waypoint from './O_Waypoint'
import { Door } from './O_Doors'
import { Player } from './O_Players'
import { JumpPad } from './O_JumpPads'
import { Bee, Slime } from './O_Enemies'
import { Key, Cherry } from './O_Pickups'

export default class SceneBase extends Phaser.Scene
{
	protected Doors: Phaser.GameObjects.Group
	protected Items: Phaser.GameObjects.Group
	protected Players: Phaser.GameObjects.Group
	protected Enemies: Phaser.GameObjects.Group
	protected JumpPads: Phaser.GameObjects.Group
	protected Waypoints: Phaser.GameObjects.Group
	protected ParallaxStatic: Phaser.GameObjects.Group
	protected ParallaxScrolling: Phaser.GameObjects.Group

    public PlayerAttacks: Phaser.Physics.Arcade.StaticGroup

	protected transition: Phaser.GameObjects.Shader
	protected player: Player

  	create() 
  	{
		this.sound.stopAll()
		this.sound.play('mus_level2', { loop: true, volume: 0.8 })

	    const map = this.make.tilemap({key: "level2"})

        const tile_props = map.addTilesetImage("props", "level2_props")
	    const tile_environment = map.addTilesetImage("environment", "level2_tiles")

		map.createLayer("Background", tile_props)

        for(let i = 8; i <= 136; i += 16)
			this.add.sprite(176, i, 'level2_waterfall').anims.play('level2_waterfall')
		map.createLayer("Props", tile_environment, 0, 0);

	    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
	    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, false)

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
	    this.cameras.main.scrollY = Helper.clamp(this.player.y - this.cameras.main.height/2, 0, this.physics.world.bounds.height - this.cameras.main.height)
	    this.Enemies.getChildren().forEach((enemy) => { enemy.update(delta) })
	    this.ParallaxStatic.getChildren().forEach((parallax) => { parallax.update(this.cameras.main.scrollX) })
		this.ParallaxScrolling.getChildren().forEach((parallax) => { parallax.update(this.cameras.main.scrollX, delta) })
	}

	initialize_map(map_key, tileset_walls, tileset_props, tileset_backs)
	{
	    this.Doors = this.add.group()
	    this.Items = this.add.group()
	    this.Players = this.add.group()
	    this.Enemies = this.add.group()
		this.JumpPads = this.add.group()
		this.Waypoints = this.add.group()
	    this.ParallaxStatic = this.add.group()
		this.ParallaxScrolling = this.add.group()
		this.PlayerAttacks = this.physics.add.staticGroup()

		const map = this.make.tilemap({key: map_key})

	    const tile_walls = map.addTilesetImage("walls", tileset_walls)
		const tile_props = map.addTilesetImage("props", tileset_props)
		const tile_backs = map.addTilesetImage("backs", tileset_backs)
		const tile_trigger = map.addTilesetImage("trigger", "trigger")

		map.createLayer("Background", tile_backs)
		map.createLayer("Props", tile_props)

        const walls = map.createLayer("Walls", tile_walls).setCollisionByExclusion([-1])
		const spikes = map.createLayer("Spikes", tile_walls).setCollisionByExclusion([-1])
	    const turners = map.createLayer("Turners", tile_trigger).setCollisionByExclusion([-1]).setVisible(this.game.config.physics.arcade.debug)
	    const slidings = map.createLayer("Slidings", tile_trigger).setCollisionByExclusion([-1]).setVisible(this.game.config.physics.arcade.debug)
		const platforms = map.createLayer("Platforms", tile_walls).setCollisionByExclusion([-1])
		platforms.forEachTile((tile) => { tile.setCollision(false, false, true, false, false); })
		
		map.createFromObjects('Objects', { name : "Waypoint", classType: Waypoint }).forEach((object) => { this.Waypoints.add(object) })
		map.createFromObjects('Objects', { name : "JumpPad", classType: JumpPad }).forEach((object) => { this.JumpPads.add(object) })
		map.createFromObjects('Objects', { name : "Player", classType: Player }).forEach((object) => { this.Players.add(object) })
	    map.createFromObjects('Objects', { name : "Cherry", classType: Cherry }).forEach((object) => { this.Items.add(object) })
	    map.createFromObjects('Objects', { name : "Slime", classType: Slime  }).forEach((object) => { this.Enemies.add(object) })
		map.createFromObjects('Objects', { name : "Door", classType: Door }).forEach((object) => { this.Doors.add(object) })
	    map.createFromObjects('Objects', { name : "Bee", classType: Bee  }).forEach((object) => { this.Enemies.add(object) })
	    map.createFromObjects('Objects', { name : "Key", classType: Key  }).forEach((object) => { this.Items.add(object) })

	    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
	    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, false)

		this.physics.add.overlap(this.PlayerAttacks, this.Enemies, (object, attack) => { this.player.attack_hit(attack, object) })
		this.physics.add.overlap(this.Players, this.Waypoints, (player, waypoint) => { (waypoint as Waypoint).change_scene() })
	    this.physics.add.overlap(this.Players, this.Enemies, (player, enemy) => { (player as Player).player_get_hit(enemy) })
	    this.physics.add.overlap(this.Players, this.Items, (picker, item) => { (item as Key).pickup(picker) })
		this.physics.add.overlap(this.Players, slidings, (player, tile) => { (player as Player).slide_lock(tile) })
		this.physics.add.overlap(this.Players, spikes, (player, tile) => { (player as Player).player_get_spiked(tile) })
	    this.physics.add.collider(this.Players, this.Doors, (player, door) => { (door as Door).open_door(player) })
	    this.physics.add.collider(this.Players, platforms)
	    this.physics.add.collider(this.Players, walls)
		this.physics.add.collider(this.Enemies, platforms)
	    this.physics.add.collider(this.Enemies, turners)
	    this.physics.add.collider(this.Enemies, walls)
		
		this.player = this.Players.getFirst()
	}
}