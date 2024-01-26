import * as Phaser from 'phaser';

export class MenuButton extends Phaser.GameObjects.Sprite
{
	private text: Phaser.GameObjects.Text;
    public action: VoidFunction;

	constructor(scene, x, y, text = "", action = () => { }) 
    {
        super(scene, x, y, 'button_idle')
        scene.add.existing(this)
        this.text = scene.add.text(x, y, text, {fontFamily: 'monospace', fontStyle: 'bold', color: '#ffffff', align: 'center' })
        this.action = action
        this.setOrigin(0.5, 0.7)
        this.idle()
    }

    update()
    {
    	this.text.setPosition(this.x, this.y)
    	this.text.setAlpha(this.alpha)
    	this.text.setScale(this.scaleX, this.scaleY)
    }


    focus()
    {
    	this.setTexture("button_focus")
        this.text.setFontSize(17).setOrigin(0.5, 0.65)
    }

    idle()
    {
    	this.setTexture("button_idle")
        this.text.setFontSize(11).setOrigin(0.5, 0.75)
    }
}

export class PopupNotice extends Phaser.GameObjects.NineSlice
{
	private text: Phaser.GameObjects.BitmapText
    private tween: Phaser.Tweens.Tween

	constructor(scene) 
    {
        super(scene, 0, 160, 'popup_notice', 0, 320, 15, 7, 7, 7, 7)
        scene.add.existing(this)
        this.setOrigin(0, 0).setScrollFactor(0).setDepth(2)
        this.text = this.scene.add.bitmapText(0, 0, "fn_bi_h", "ứ ứ Ứ X x Checkpoint Game Saved Gained Trolling Sword").setScrollFactor(0).setDepth(2)
        this.text.visible = false
    }

    notice(msg: string)
    {
        this.text.text = msg
        this.text.visible = true
        this.visible = true
        this.scene.tweens.add({ targets: this, y: 145, ease: 'sine.out', duration: 500, hold: 1000, yoyo: true,
            onComplete: () => { this.visible = false; this.text.visible = false; },
            onUpdate: () => { Phaser.Display.Align.In.Center(this.text, this, 0, -0.5) } })
    }
}