import * as Phaser from 'phaser'
import LevelBase from './LevelBase'

export default class Scene_Level1f extends LevelBase
{
	constructor() 
	{
    	super({ key: "Scene_Level1f" })
  	}

  	preload() 
  	{
	    this.load.image('level1_walls3', 'assets/level1/walls3.png')
	    this.load.image('level1_props', 'assets/level1/props.png')
		this.load.image('level1_backs', 'assets/level1/backs.png')
	    this.load.tilemapTiledJSON('level1f', 'assets/level1/map1f.json')
  	}

  	create() 
  	{
		super.create()
		const map = this.initialize_map('level1f', 'level1_walls3', 'level1_props', 'level1_backs')
  	}
}