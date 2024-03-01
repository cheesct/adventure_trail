import * as Phaser from 'phaser'
import LevelBase from './LevelBase'

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
	    this.load.tilemapTiledJSON('level1d', 'assets/level1/map1d.json')
  	}

  	create() 
  	{
		const map = this.initialize_map('level1d', 'level1_walls2', 'level1_props', 'level1_backs')
		const emitter = this.add.particles(0, 0, 'flares', {
            frame: 'white',
            blendMode: 'ADD',
            quantity: 1,
            lifespan: { min: 5000, max: 10000 } ,
            frequency: 50,
            scale: { start: 0.3, end: 0, random: true },
            speed: { min: 0, max: 5 },
            alpha: { values: [ 0, 0.5, 0 ], interpolation: 'linear' },
            angle: { min: 0, max: 360 },
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, map.widthInPixels, map.heightInPixels), type: 'random' }
        })
  	}
}