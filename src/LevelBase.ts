import * as Phaser from 'phaser'
import Helper from './helper'
import Singleton from './singleton'
import { Door } from './O_Doors'
import { Player } from './O_Players'
import { JumpPad } from './O_JumpPads'
import { Key, Cherry } from './O_Pickups'
import { Bee, Slime, GrenadierPlant, PiranhaPlant } from './O_Enemies'
import { PopupNotice }  from './O_MenuComponents'
import { Waypoint, Checkpoint }  from './O_ProgressionComponents'

export default class LevelBase extends Phaser.Scene
{
	private transition: Phaser.GameObjects.Shader
	private notice: PopupNotice

	protected Doors: Phaser.GameObjects.Group
	protected Items: Phaser.GameObjects.Group
	protected Enemies: Phaser.GameObjects.Group
	protected JumpPads: Phaser.GameObjects.Group
	protected Waypoints: Phaser.GameObjects.Group
	protected Checkpoints: Phaser.GameObjects.Group
	//protected ParallaxStatic: Phaser.GameObjects.Layer
	//protected ParallaxScrolling: Phaser.GameObjects.Layer

	protected player: Player

	public Lights: Phaser.GameObjects.Group
	public Players: Phaser.GameObjects.Group
	public EnemyBullets: Phaser.Physics.Arcade.Group
	public EnemySensors: Phaser.Physics.Arcade.StaticGroup
	public EnemyAttacks: Phaser.Physics.Arcade.StaticGroup
    public PlayerAttacks: Phaser.Physics.Arcade.StaticGroup
	public ObjectOffset: number = 0

  	create() 
  	{
  	}

  	update(time, delta)
  	{
		delta = delta / 1000
	    this.player.update(delta)
		this.cameras.main.scrollX = Helper.clamp(this.player.x - this.cameras.main.width/2, 0, this.physics.world.bounds.width - this.cameras.main.width)
	    this.cameras.main.scrollY = Helper.clamp(this.player.y - this.cameras.main.height/2, 0, this.physics.world.bounds.height - this.cameras.main.height)
	    this.Enemies.getChildren().forEach((x) => { x.update(delta) })
		this.EnemyAttacks.getChildren().forEach((x) => { x.update(delta) })
		this.EnemyBullets.getChildren().forEach((x) => { x.update(delta) })
	    //this.ParallaxStatic.getChildren().forEach((x) => { x.update(this.cameras.main.scrollX) })
		//this.ParallaxScrolling.getChildren().forEach((x) => { x.update(this.cameras.main.scrollX, delta) })
	}

	initialize_map(map_key, tileset_walls, tileset_props, tileset_backs)
	{
	    this.Doors = this.add.group()
	    this.Items = this.add.group()
	    this.Players = this.add.group()
	    this.Enemies = this.add.group()
		this.JumpPads = this.add.group()
		this.Waypoints = this.add.group()
		this.Checkpoints = this.add.group()
	    //this.ParallaxStatic = this.add.layer()
		//this.ParallaxScrolling = this.add.layer()
		this.PlayerAttacks = this.physics.add.staticGroup()
		this.EnemyAttacks = this.physics.add.staticGroup()
		this.EnemySensors = this.physics.add.staticGroup()
		this.EnemyBullets = this.physics.add.group({ allowGravity: false })

		const is_debug = this.game.config.physics.arcade.debug
		const map = this.make.tilemap({key: map_key})

	    const tile_walls = map.addTilesetImage("walls", tileset_walls)
		const tile_props = map.addTilesetImage("props", tileset_props)
		const tile_backs = map.addTilesetImage("backs", tileset_backs)
		const tile_trigger = map.addTilesetImage("trigger", "trigger")

		map.createLayer("Background", tile_backs)//.setPipeline("Light2D")
		map.createLayer("Props", tile_props)

		let spikes
		let platforms

		if (map.getLayerIndex("Spikes"))
		{
			spikes = map.createLayer("Spikes", tile_walls).setCollisionByExclusion([-1])
		}
	    const turners = map.createLayer("Turners", tile_trigger).setCollisionByExclusion([-1]).setVisible(is_debug)
	    const slidings = map.createLayer("Slidings", tile_trigger).setCollisionByExclusion([-1]).setVisible(is_debug)
		if (map.getLayerIndex("Platforms"))
		{
			platforms = map.createLayer("Platforms", tile_walls).setCollisionByExclusion([-1])
			platforms.forEachTile((tile) => { tile.setCollision(false, false, true, false, false); })
		}
        const walls = map.createLayer("Walls", tile_walls).setCollisionByExclusion([-1])

		map.createFromObjects('Objects', { name : "Checkpoint", classType: Checkpoint }).forEach((object) => { this.Checkpoints.add(object) })
		map.createFromObjects('Objects', { name : "Waypoint", classType: Waypoint }).forEach((object) => { this.Waypoints.add(object) })
		map.createFromObjects('Objects', { name : "JumpPad", classType: JumpPad }).forEach((object) => { this.JumpPads.add(object) })
		map.createFromObjects('Objects', { name : "Door", classType: Door }).forEach((object) => { this.Doors.add(object) })
		map.createFromObjects('Objects', { name : "Player", classType: Player }).forEach((object: Player) => { this.player = object; this.Players.add(object) })
	    
		map.createFromObjects('Objects', { name : "PiranhaPlant", classType: PiranhaPlant }).forEach((object) => { this.Enemies.add(object) })
	    map.createFromObjects('Objects', { name : "Grenadier", classType: GrenadierPlant }).forEach((object) => { this.Enemies.add(object) })
		map.createFromObjects('Objects', { name : "Slime", classType: Slime }).forEach((object) => { this.Enemies.add(object) })
	    map.createFromObjects('Objects', { name : "Bee", classType: Bee }).forEach((object) => { this.Enemies.add(object) })

		map.createFromObjects('Objects', { name : "Cherry", classType: Cherry }).forEach((object) => { this.Items.add(object) })
	    map.createFromObjects('Objects', { name : "Key", classType: Key }).forEach((object) => { this.Items.add(object) })

	    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
	    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, false)

		this.physics.add.overlap(this.Enemies, this.PlayerAttacks, (enemy, attack) => { this.player.attack_hit(attack, enemy) })
		this.physics.add.overlap(this.Players, this.Checkpoints, (player, checkpoint) => { this.check_point(checkpoint) })
		this.physics.add.overlap(this.Players, this.Waypoints, (player, waypoint) => { this.change_scene(waypoint) })
		this.physics.add.overlap(this.Players, this.JumpPads, (player, pad) => { (player as Player).set_jumpPad(pad) })
		this.physics.add.overlap(this.Players, this.Enemies, (player, enemy) => { (player as Player).player_get_hit(enemy) })
		this.physics.add.overlap(this.Players, this.EnemyBullets, (player, bullet) => { (player as Player).player_get_shot(bullet) })
		this.physics.add.overlap(this.Players, this.Items, (picker, item) => { (item as Key).pickup(picker) })
		this.physics.add.overlap(this.Players, slidings, (player, tile) => { (player as Player).slide_lock(tile) })
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
		this.notice = new PopupNotice(this)
		this.fade_in()
		return map
	}

	fade_in(force: boolean = false)
    {
        if (this.game.config.renderType == Phaser.WEBGL && (Singleton.transition_name || force))
		{
			this.transition = this.add.shader("transition_diamond", this.cameras.main.scrollX + this.cameras.main.centerX, this.cameras.main.scrollY + this.cameras.main.centerY, this.cameras.main.width, this.cameras.main.height).setScrollFactor(0)
			this.transition.depth = 10
			this.transition.uniforms.flag.value = Singleton.transition_flag
			this.transition.uniforms.inversion.value = true
			this.tweens.add({ targets: this.transition.uniforms.progress, value: 1.0, ease: 'Linear', duration: 1000 })
			Singleton.transition_name = null
		}
		else
		{
			this.cameras.main.fadeIn(1500)
		}
    }

	fade_out(to: string, flag: number = 0)
    {
        if (this.transition)
        {
            Singleton.transition_name = "1"
            Singleton.transition_flag = flag
			this.transition.uniforms.flag.value = flag
			this.transition.uniforms.progress.value = 0
            this.transition.uniforms.inversion.value = false
            this.tweens.add({ targets: this.transition.uniforms.progress, value: 1.0, ease: 'Linear', duration: 1000,
                onComplete: () => { this.scene.start(to) }
            })
        }
        else
        {
            this.cameras.main.fadeOut(1500, 0, 0, 0, () => { this.scene.start(to) })
        }
    }

	change_scene(waypoint)
	{
		const destination = waypoint.data.list.To
        if (destination)
        {
            if (waypoint.data.list.ArriveX && waypoint.data.list.ArriveY)
            {
                Singleton.is_waypoint_travel = true
                Singleton.waypoint_landing_x = waypoint.data.list.ArriveX
                Singleton.waypoint_landing_y = waypoint.data.list.ArriveY
            }
            else
            {
                Singleton.is_waypoint_travel = false
            }
			this.fade_out(destination, 0)
        }
		waypoint.destroy()
	}

	check_point(checkpoint)
	{
		Singleton.checkpoint_level = (this.sys.config as Phaser.Types.Scenes.SettingsConfig).key
		Singleton.checkpoint_x = checkpoint.x
		Singleton.checkpoint_y = checkpoint.y
		checkpoint.activate()
		this.notice.notice("Checkpoint")
		this.cameras.main.flash(250, 0, 204, 204)
	}
}