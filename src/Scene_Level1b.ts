import LevelBase from './LevelBase'
import { ParallaxStaticTileSprite } from './O_ParallaxComponents'

export default class Scene_Level1b extends LevelBase
{
	constructor() 
	{
    	super({ key: "Scene_Level1b" })
  	}

	init(data)
	{
		if (data && (data.music != 'mus_level1'))
		{
			this.sound.stopAll()
			this.sound.play('mus_level1', { loop: true, volume: 0.8 })
			this.music = 'mus_level1'
		}
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
	    this.load.tilemapTiledJSON('level1b', 'assets/level1/map1b.json')
  	}

  	create() 
  	{
		this.add.tileSprite(0, 0, 320, 112, "sky").setOrigin(0).setScrollFactor(0)
		super.create()
		this.ParallaxStatic.add(new ParallaxStaticTileSprite(this, 0, 82, 320, 32, "mountains2", 0.125))
		this.ParallaxStatic.add(new ParallaxStaticTileSprite(this, 0, 88, 320, 32, "mountains1", 0.25))
		this.ParallaxStatic.add(new ParallaxStaticTileSprite(this, 0, 112, 320, 64, "grass", 0.5))
		this.initialize_map('level1b', 'level1_walls', 'level1_props', 'level1_backs')
  	}
}