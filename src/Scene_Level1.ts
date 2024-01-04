import LevelBase from './LevelBase'
import { ParallaxScrollingImage, ParallaxStaticTileSprite } from './O_ParallaxComponents'

export default class Scene_Level1 extends LevelBase
{
	private ParallaxStatic: Phaser.GameObjects.Container
	private ParallaxScrolling: Phaser.GameObjects.Container

	constructor() 
	{
    	super({ key: "Scene_Level1" })
  	}

  	preload() 
  	{
	    this.load.image('level1_walls', 'assets/level1/walls.png')
	    this.load.image('level1_props', 'assets/level1/props.png')
		this.load.image('level1_backs', 'assets/level1/backs.png')
	    this.load.image('sky', 'assets/level1/background.png')
	    this.load.image('grass', 'assets/level1/grass.png')
	    this.load.image('cloud1', 'assets/level1/cloud1.png')
	    this.load.image('cloud2', 'assets/level1/cloud2.png')
	    this.load.image('cloud3', 'assets/level1/cloud3.png')
	    this.load.image('mountains1', 'assets/level1/mountains1.png')
	    this.load.image('mountains2', 'assets/level1/mountains2.png')
	    this.load.tilemapTiledJSON('level1', 'assets/level1/map1.json')
  	}

  	create() 
  	{
		//this.sound.stopAll()
		//this.sound.play('mus_level1', { loop: true, volume: 0.8 })
		this.load.scenePlugin({
            key: 'slope',
            url: 'plugins/phaser-arcade-slopes.min.js',
            sceneKey: 'slope'
        });
	    this.add.tileSprite(0, 0, 320, 112, "sky").setOrigin(0).setScrollFactor(0)
		this.ParallaxStatic = this.add.container()
        this.ParallaxScrolling = this.add.container()
		this.ParallaxStatic.add(new ParallaxStaticTileSprite(this, 0, 82, 320, 32, "mountains2", 0.125))
		this.ParallaxStatic.add(new ParallaxStaticTileSprite(this, 0, 88, 320, 32, "mountains1", 0.25))
		this.ParallaxStatic.add(new ParallaxStaticTileSprite(this, 0, 112, 320, 64, "grass", 0.5))
	    this.ParallaxScrolling.add(new ParallaxScrollingImage(this, 160, 4, "cloud1", -3, 100, 420))
	    this.ParallaxScrolling.add(new ParallaxScrollingImage(this, -20, 20, "cloud2", -6, 100, 420))
	    this.ParallaxScrolling.add(new ParallaxScrollingImage(this, 40, 20, "cloud2", -6, 100, 420))
		this.ParallaxScrolling.add(new ParallaxScrollingImage(this, 120, 16, "cloud2", -6, 100, 420))
	    this.ParallaxScrolling.add(new ParallaxScrollingImage(this, 240, 24, "cloud2", -6, 100, 420))
	    this.ParallaxScrolling.add(new ParallaxScrollingImage(this, 320, 28, "cloud2", -6, 100, 420))
	    this.ParallaxScrolling.add(new ParallaxScrollingImage(this, 16, 32, "cloud3", -10, 100, 420))
	    this.ParallaxScrolling.add(new ParallaxScrollingImage(this, 80, 32, "cloud3", -10, 100, 420))
	    this.ParallaxScrolling.add(new ParallaxScrollingImage(this, 200, 32, "cloud3", -10, 100, 420))
	    this.ParallaxScrolling.add(new ParallaxScrollingImage(this, 280, 32, "cloud3", -10, 100, 420))
		this.initialize_map('level1', 'level1_walls', 'level1_props', 'level1_backs')
  	}

	  update(time, delta)
  	{
		super.update(time, delta)
		delta = delta / 1000
	    this.ParallaxStatic.list.forEach((x) => { x.update(this.cameras.main.scrollX) })
		this.ParallaxScrolling.list.forEach((x) => { x.update(this.cameras.main.scrollX, delta) })
	}
}