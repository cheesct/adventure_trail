import * as Phaser from 'phaser'
import Helper from './helper'
import Singleton from './singleton'
import { Door } from './O_Doors'
import { Slope } from './O_Slope'
import { Player } from './O_Players'
import { JumpPad } from './O_JumpPads'
import { Key, Cherry } from './O_Pickups'
import { Bee, Frog, Slime, GrenadierPlant, PiranhaPlant } from './O_Enemies'
import { PopupNotice }  from './O_MenuComponents'
import { Waypoint, Checkpoint }  from './O_ProgressionComponents'

export default class LevelBase extends Phaser.Scene
{
	private transition: Phaser.GameObjects.Shader
	private notice: PopupNotice

	protected FogCanvas: Phaser.Textures.CanvasTexture

	protected Doors: Phaser.GameObjects.Group
	protected Items: Phaser.GameObjects.Group
	protected Slopes: Phaser.GameObjects.Group
	protected Enemies: Phaser.GameObjects.Group
	protected JumpPads: Phaser.GameObjects.Group
	protected Waypoints: Phaser.GameObjects.Group
	protected Checkpoints: Phaser.GameObjects.Group
	protected ParallaxStatic: Phaser.GameObjects.Layer
	protected ParallaxScrolling: Phaser.GameObjects.Layer

	protected SlideLockLayer: Phaser.Tilemaps.TilemapLayer

	protected player: Player
	protected music: string

	public Players: Phaser.GameObjects.Group
	public EnemyBullets: Phaser.Physics.Arcade.Group
	public EnemySensors: Phaser.Physics.Arcade.StaticGroup
	public EnemyAttacks: Phaser.Physics.Arcade.StaticGroup
    public PlayerAttacks: Phaser.Physics.Arcade.StaticGroup
	public ObjectOffset: number = 0
	
	private graphics: any
	private initData: any
	private passData: any = {}

  	create() 
  	{
	    this.Doors = this.add.group()
	    this.Items = this.add.group()
	    this.Slopes = this.add.group()
	    this.Players = this.add.group()
	    this.Enemies = this.add.group()
		this.JumpPads = this.add.group()
		this.Waypoints = this.add.group()
		this.Checkpoints = this.add.group()
	    this.ParallaxStatic = this.add.layer()
		this.ParallaxScrolling = this.add.layer()
		this.PlayerAttacks = this.physics.add.staticGroup()
		this.EnemyAttacks = this.physics.add.staticGroup()
		this.EnemySensors = this.physics.add.staticGroup()
		this.EnemyBullets = this.physics.add.group({ allowGravity: false })
  	}

	init(data)
	{
		this.initData = data
	}

  	update(time, delta)
  	{
		delta = delta / 1000
		this.physics.world.overlap(this.player, this.SlideLockLayer, (player, tile) => { (player as Player).slide_lock(tile) })
	    this.player.update(delta)
		this.cameras.main.scrollX = Helper.clamp(this.player.x - this.cameras.main.width/2, 0, this.physics.world.bounds.width - this.cameras.main.width)
	    this.cameras.main.scrollY = Helper.clamp(this.player.y - this.cameras.main.height/2, 0, this.physics.world.bounds.height - this.cameras.main.height)
	    this.Enemies.getChildren().forEach((x) => { x.update(delta) })
		this.EnemyAttacks.getChildren().forEach((x) => { x.update(delta) })
		this.EnemyBullets.getChildren().forEach((x) => { x.update(delta) })
	    this.ParallaxStatic.getChildren().forEach((x) => { x.update(this.cameras.main.scrollX) })
		this.ParallaxScrolling.getChildren().forEach((x) => { x.update(this.cameras.main.scrollX, delta) })

		//manually handle slope logic
		let bound = this.player.body.getBounds(new Phaser.Geom.Rectangle()) as Phaser.Geom.Rectangle
		for (var i = 0; i < this.Slopes.getChildren().length; i++)
        {
			var slope = this.Slopes.getChildren()[i] as Slope
			if (Phaser.Geom.Intersects.RectangleToTriangle(bound, slope.triangle))
			{
				this.player.set_slope(slope)
				this.graphics.lineStyle(2, 0xff0000)
			}
			else
			{
				this.graphics.lineStyle(2, 0xffff00)
			}
			if (this.game.config.physics.arcade.debug)
			{
				slope.render(this.graphics)
			}
		}

		if (this.FogCanvas)
		{
			this.FogCanvas.context.globalCompositeOperation = "copy"
			this.FogCanvas.context.fillStyle = "#000"
			this.FogCanvas.context.fillRect(0, 0, this.FogCanvas.width, this.FogCanvas.height)
			this.FogCanvas.context.globalCompositeOperation = "destination-out"
			this.FogCanvas.context.fillStyle = "#88888888"
			const tau = 2*Math.PI
			const flicker = Phaser.Math.FloatBetween(-1, 1)
			const offsetX = 64 - this.cameras.main.scrollX
			const offsetY = 64 - this.cameras.main.scrollY
			this.Checkpoints.getChildren().forEach((x: Phaser.GameObjects.Sprite) => { 
				this.FogCanvas.context.beginPath();
				this.FogCanvas.context.arc(x.x + offsetX, x.y + offsetY, 30, 0, tau);
				this.FogCanvas.context.fill();
				this.FogCanvas.context.arc(x.x + offsetX, x.y + offsetY, 45 + flicker, 0, tau);
				this.FogCanvas.context.fill()
			})
			this.EnemyBullets.getChildren().forEach((x: Phaser.GameObjects.Sprite) => { 
				this.FogCanvas.context.beginPath();
				this.FogCanvas.context.arc(x.x + offsetX, x.y + offsetY, 20, 0, tau);
				this.FogCanvas.context.fill();
				this.FogCanvas.context.arc(x.x + offsetX, x.y + offsetY, 25, 0, tau);
				this.FogCanvas.context.fill()
			})
			if(this.player.state != "DeathSpike")
			{
				this.FogCanvas.context.beginPath()
				this.FogCanvas.context.arc(this.player.x + offsetX, this.player.y + offsetY, 40, 0, tau)
				this.FogCanvas.context.fill()
				this.FogCanvas.context.arc(this.player.x + offsetX, this.player.y + offsetY, 60 + flicker, 0, tau)
				this.FogCanvas.context.fill()
			}
			this.FogCanvas.refresh()
		}
	}

	initialize_map(map_key, tileset_walls, tileset_props, tileset_backs)
	{
		const is_debug = this.game.config.physics.arcade.debug
		const map = this.make.tilemap({key: map_key})
	    const tile_walls = map.addTilesetImage("walls", tileset_walls)
		const tile_props = map.addTilesetImage("props", tileset_props)
		const tile_backs = map.addTilesetImage("backs", tileset_backs)
		const tile_trigger = map.addTilesetImage("trigger", "trigger")

		map.createLayer("Background", tile_backs)
		map.createLayer("Props", tile_props)

		let spikes
		let platforms

		if (map.getLayerIndex("Spikes"))
		{
			spikes = map.createLayer("Spikes", tile_walls).setCollisionByExclusion([-1])
		}
	    const turners = map.createLayer("Turners", tile_trigger).setCollisionByExclusion([-1]).setVisible(is_debug)
	    this.SlideLockLayer = map.createLayer("Slidings", tile_trigger).setCollisionByExclusion([-1]).setVisible(is_debug)
		if (map.getLayerIndex("Platforms"))
		{
			platforms = map.createLayer("Platforms", tile_walls).setCollisionByExclusion([-1])
			platforms.forEachTile((tile) => { tile.setCollision(false, false, true, false, false); })
		}
        const walls = map.createLayer("Walls", tile_walls).setCollisionByExclusion([-1])
		if (map.getLayerIndex("Slopes"))
		{
			map.createLayer("Slopes", tile_walls).setCollisionByExclusion([-1])
		}

		map.createFromObjects('Objects', { name : "Checkpoint", classType: Checkpoint }).forEach((object) => { this.Checkpoints.add(object) })
		map.createFromObjects('Objects', { name : "Waypoint", classType: Waypoint }).forEach((object) => { this.Waypoints.add(object) })
		map.createFromObjects('Objects', { name : "JumpPad", classType: JumpPad }).forEach((object) => { this.JumpPads.add(object) })
		map.createFromObjects('Objects', { name : "Door", classType: Door }).forEach((object) => { this.Doors.add(object) })

		map.createFromObjects('Objects', { name : "Player", classType: Player }).forEach((object: Player) => { this.player = object; this.Players.add(object) })
	    
		map.createFromObjects('Objects', { name : "PiranhaPlant", classType: PiranhaPlant }).forEach((object) => { this.Enemies.add(object) })
	    map.createFromObjects('Objects', { name : "Grenadier", classType: GrenadierPlant }).forEach((object) => { this.Enemies.add(object) })
		map.createFromObjects('Objects', { name : "Slime", classType: Slime }).forEach((object) => { this.Enemies.add(object) })
		map.createFromObjects('Objects', { name : "Frog", classType: Frog }).forEach((object) => { this.Enemies.add(object) })
	    map.createFromObjects('Objects', { name : "Bee", classType: Bee }).forEach((object) => { this.Enemies.add(object) })

		map.createFromObjects('Objects', { name : "Cherry", classType: Cherry }).forEach((object) => { this.Items.add(object) })
	    map.createFromObjects('Objects', { name : "Key", classType: Key }).forEach((object) => { this.Items.add(object) })

		let slopes = map.getObjectLayer('Slopes')
		if (slopes)
		{
			for (let i = 0; i < slopes.objects.length; i++)
			{
				let slope = slopes.objects[i]
				this.Slopes.add(new Slope(this, slope.x, slope.y, slope.width, slope.height))
			}
		}

	    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
	    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, false)

		this.physics.add.overlap(this.Enemies, this.PlayerAttacks, (enemy, attack) => { this.player.attack_hit(attack, enemy) })
		this.physics.add.overlap(this.Players, this.Checkpoints, (player, checkpoint) => { this.check_point(checkpoint) })
		this.physics.add.overlap(this.Players, this.Waypoints, (player, waypoint) => { this.change_scene(waypoint) })
		this.physics.add.overlap(this.Players, this.JumpPads, (player, pad) => { (player as Player).set_jumpPad(pad) })
		this.physics.add.overlap(this.Players, this.Enemies, (player, enemy) => { (player as Player).player_get_hit(enemy) })
		this.physics.add.overlap(this.Players, this.EnemyBullets, (player, bullet) => { (player as Player).player_get_shot(bullet) })
		this.physics.add.overlap(this.Players, this.Items, (picker, item) => { (item as Key).pickup(picker) })
		// this.physics.add.overlap(this.Players, slidings, (player, tile) => { (player as Player).slide_lock(tile) })
		this.physics.add.collider(this.Players, this.Doors, (player, door) => { (door as Door).open_door(player) })
		this.physics.add.collider(this.Players, walls)
		this.physics.add.collider(this.Enemies, turners)
		this.physics.add.collider(this.Enemies, walls)
		this.physics.add.collider(this.EnemyBullets, walls, (bullet, wall) => { bullet.destroy() })
		this.physics.add.collider(this.EnemyBullets, this.Doors, (bullet, door) => { bullet.destroy() })

		if (spikes)
		{
			this.physics.add.overlap(this.Players, spikes, (player, tile) => { (player as Player).player_get_spiked(tile) })
		}
		if (platforms)
		{
			this.physics.add.collider(this.Players, platforms)
			this.physics.add.collider(this.Enemies, platforms)
		}

		if (is_debug)
		{
			const graphics = this.add.graphics().setAlpha(0.75).setDepth(20)
			walls.renderDebug(graphics, {
				tileColor: null, // Color of non-colliding tiles
				faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
				collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			})
		}

		
		this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00aa00 } });

		this.notice = new PopupNotice(this)

		//check if this level has fog effect
		var map_properties = map.properties as any
		if (Array.isArray(map_properties))
		{
			var map_fog = map_properties.find(e => e.name === "Fog")
			if (map_fog)
			{
				if (this.textures.exists("fog"))
				{
					this.FogCanvas = this.textures.get("fog") as Phaser.Textures.CanvasTexture
				}
				else
				{
					this.FogCanvas = this.textures.createCanvas("fog", this.cameras.main.width + 128, this.cameras.main.height + 128)
				}
				const fog = this.add.image(-64, -64, "fog").setOrigin(0).setDepth(1).setScrollFactor(0)
				fog.alpha = map_fog.value
			}
			var music = map_properties.find(e => e.name === "Music")
			if (music && this.initData?.music != music.value)
			{
				this.sound.stopAll()
				this.sound.play(music.value, { loop: true, volume: 0.8 })
				this.passData.music = music.value
			}
		}

		Singleton.sceneTransIn(this, this.initData?.transitionFlag)
		return map
	}

	change_scene(waypoint)
	{
		const destination = waypoint.data.list.To
        if (destination)
        {
            if (waypoint.data.list.ArriveX && waypoint.data.list.ArriveY)
            {
				this.passData.arriveX = waypoint.data.list.ArriveX
				this.passData.arriveX = waypoint.data.list.ArriveY
            }
			Singleton.sceneTransOut(this, 0, destination, this.passData)
        }
		waypoint.destroy()
	}

	check_point(checkpoint)
	{
		this.passData.checkpointLevel = (this.sys.config as Phaser.Types.Scenes.SettingsConfig).key
		this.passData.checkpointX = checkpoint.x
		this.passData.checkpointY = checkpoint.y
		checkpoint.activate()
		this.notice.notice("Checkpoint")
		this.cameras.main.flash(250, 0, 204, 204)
		this.player.player_heal_full()
	}
}