import * as Phaser from 'phaser'
import LevelBase from './LevelBase'

export default class Scene_Level1e extends LevelBase
{
	constructor() 
	{
    	super({ key: "Scene_Level1e" })
  	}

	init(data)
	{
		if (data && (data.music != 'mus_level1' && data.music != undefined))
		{
			this.sound.stopAll()
			this.sound.play('mus_level1', { loop: true, volume: 0.8 })
			this.music = 'mus_level1'
		}
	}

  	preload() 
  	{
	    this.load.image('level1_walls3', 'assets/level1/walls3.png')
	    this.load.image('level1_props', 'assets/level1/props.png')
		this.load.image('level1_backs', 'assets/level1/backs.png')
	    this.load.tilemapTiledJSON('level1e', 'assets/level1/map1e.json')
  	}

  	create() 
  	{
		super.create()
		const map = this.initialize_map('level1e', 'level1_walls3', 'level1_props', 'level1_backs')
  	}
}