import LevelBase from './LevelBase'
import Singleton from './singleton'
import { ParallaxStaticTileSprite } from './O_ParallaxComponents'

export default class Scene_Level1c extends LevelBase
{
	private ParallaxStatic: Phaser.GameObjects.Container

	constructor() 
	{
    	super({ key: "Scene_Level1c" })
  	}

  	preload() 
  	{
	    this.load.image('level1_walls', 'assets/level1/walls.png')
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
		this.initialize_map('level1c', 'level1_walls', 'level1_props', 'level1_backs')
  	}
}