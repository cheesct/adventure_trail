import * as Phaser from 'phaser'
import LevelBase from './LevelBase'
import { ParallaxStaticTileSprite } from './O_ParallaxComponents'

export default class Scene_Level1d extends LevelBase
{
	private ParallaxStatic: Phaser.GameObjects.Container

	constructor() 
	{
    	super({ key: "Scene_Level1d" })
  	}

  	preload() 
  	{
	    this.load.image('level1_walls2', 'assets/level1/walls2.png')
	    this.load.image('level1_props', 'assets/level1/props.png')
		this.load.image('level1_backs', 'assets/level1/backs.png')
	    this.load.image('sky', 'assets/level1/background.png')
	    this.load.image('grass', 'assets/level1/grass.png')
	    this.load.image('mountains1', 'assets/level1/mountains1.png')
	    this.load.image('mountains2', 'assets/level1/mountains2.png')
	    this.load.tilemapTiledJSON('level1c', 'assets/level1/map1c.json')
  	}

  	create() 
  	{
		this.add.tileSprite(0, 0, 320, 112, "sky").setOrigin(0).setScrollFactor(0)
		this.ParallaxStatic = this.add.container()
		this.ParallaxStatic.add(new ParallaxStaticTileSprite(this, 0, 82, 320, 32, "mountains2", 0.125))
		this.ParallaxStatic.add(new ParallaxStaticTileSprite(this, 0, 88, 320, 32, "mountains1", 0.25))
		this.ParallaxStatic.add(new ParallaxStaticTileSprite(this, 0, 112, 320, 64, "grass", 0.5))
		const map = this.initialize_map('level1c', 'level1_walls2', 'level1_props', 'level1_backs')
		const emitter = this.add.particles(0, 0, 'flares', {
            frame: 'white',
            blendMode: 'ADD',
            quantity: 1,
            lifespan: { min: 5000, max: 10000 } ,
            frequency: 100,
            scale: { start: 0.4, end: 0, random: true },
            speed: { min: 0, max: 5 },
            alpha: { values: [ 1, 0, 1 ], interpolation: 'linear' },
            angle: { min: 0, max: 360 },
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, map.widthInPixels, map.heightInPixels), type: 'random' }
        })
		this.lights.enable()
		//this.lights.disable()
        this.lights.setAmbientColor(0xFFFFFF)
		this.lights.addLight(100, 100, 200);
  	}

	  update(time, delta)
  	{
		super.update(time, delta)
	}
}