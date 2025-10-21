import * as Phaser from 'phaser'
import LevelBase from './LevelBase'

export default class Scene_Level1c extends LevelBase
{
	constructor() 
	{
    	super({ key: "Scene_Level1c" })
  	}

  	preload() 
  	{
	    this.load.image('level1_walls2', 'assets/level1/walls3.png')
	    this.load.image('level1_props', 'assets/level1/props.png')
		this.load.image('level1_backs', 'assets/level1/backs.png')
	    this.load.tilemapTiledJSON('level1c', 'assets/level1/map1c.json')
  	}

  	create() 
  	{
		super.create()
		const map = this.initialize_map('level1c', 'level1_walls2', 'level1_props', 'level1_backs')
  	}
}