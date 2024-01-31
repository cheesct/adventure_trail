import * as Phaser from 'phaser'
import LevelBase from './LevelBase'

export default class Scene_Level2 extends LevelBase
{
    private lighting: any

	constructor() 
	{
    	super({ key: "Scene_Level2" })
  	}

  	preload() 
  	{
	    this.load.image('level2_walls', 'assets/level2/walls.png')
	    this.load.image('level2_props', 'assets/level2/props.png')
		this.load.image('level2_backs', 'assets/level2/backs.png')
	    this.load.tilemapTiledJSON('level2', 'assets/level2/map2.json')
  	}

  	create() 
  	{
		const map = this.initialize_map('level2', 'level2_walls', 'level2_props', 'level2_backs')
		
        for(let i = 8; i <= 136; i += 16)
			this.add.sprite(176, i, 'level2_waterfall').anims.play('level2_waterfall')

        this.add.sprite(160, 144, 'level2_water').anims.play('level2_water')
		this.add.sprite(192, 144, 'level2_water').anims.play('level2_water')
		for(let i = 1488; i <= 1776; i += 32)
			this.add.sprite(i, 144, 'level2_lava').anims.play('level2_lava')
		
        this.lighting = this.textures.createCanvas('lights', map.widthInPixels, map.heightInPixels)
	    if(!this.lighting)
	    	this.lighting = this.textures.get('lights')
	    this.add.image(0, 0, "lights").setOrigin(0).setDepth(1)
  	}

  	update(time, delta)
  	{
		super.update(time, delta)
	    this.lighting.context.globalCompositeOperation = 'copy';
	    this.lighting.context.fillStyle = '#000000ff';
		const offset = 10
		const filler = offset * 2
    	this.lighting.context.fillRect(this.cameras.main.scrollX - offset, this.cameras.main.scrollY - offset, this.cameras.main.width + filler, this.cameras.main.height + filler);
    	this.lighting.context.globalCompositeOperation = 'destination-out';
		this.lighting.context.fillStyle = '#ffffff88';
		if(this.player.state != "DeathSpike")
		{
			let tau = 2*Math.PI
			let flicker = Phaser.Math.FloatBetween(-1, 1)
			this.lighting.context.beginPath();
			this.lighting.context.arc(this.player.x, this.player.y, 50, 0, tau);
			this.lighting.context.fill();
			this.lighting.context.arc(this.player.x, this.player.y, 70 + flicker * 0.5, 0, tau);
			this.lighting.context.fill();
			this.lighting.context.arc(this.player.x, this.player.y, 80 + flicker, 0, tau);
			this.lighting.context.fill();
		}
		this.lighting.context.fillStyle = '#ffffff11';
		for (let i = 0; i < 15; i++)
		{
			let rand = Phaser.Math.FloatBetween(-1, 1);
			this.lighting.context.fillRect(1472 - i*4 + rand, 0, 336 + 8*i - 2*rand, 160);
		}
    	this.lighting.refresh();
	}
}