import * as Phaser from 'phaser'
import LevelBase from './LevelBase'

export default class Scene_Level1f extends LevelBase
{
	constructor() 
	{
    	super({ key: "Scene_Level1f" })
  	}

  	create() 
  	{
		super.create()
		const map = this.initialize_map('level1f', 'level1_walls3', 'level1_props', 'level1_backs')
  	}
}