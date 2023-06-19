import * as Phaser from 'phaser'
import { MenuButton } from './O_MenuComponents'
import Singleton from './singleton'
import Helper from './helper'

export default class Scene_Menu extends Phaser.Scene 
{
    private state: string
    private control: boolean
    private Selected_Button: number

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private keyZ: Phaser.Input.Keyboard.Key
    private rectangle: Phaser.GameObjects.Rectangle
    private title: Phaser.GameObjects.Text
    private button: Array<MenuButton>
    private help_container: Phaser.GameObjects.Container
    private credit_container: Phaser.GameObjects.Container
    private bg_grass1: Phaser.GameObjects.TileSprite
    private bg_grass2: Phaser.GameObjects.TileSprite
    private bg_clouds: Phaser.GameObjects.TileSprite
    private bg_mountains: Phaser.GameObjects.TileSprite

    constructor() 
    {
        super({ key: "Scene_Menu" })
        this.control = false
        this.state = ""
    }

    transitioning(transition_to)
    {
        const transition = this.add.shader("transition_diamond", 0, 0, this.cameras.main.width, this.cameras.main.height).setOrigin(0)
        const singleton = Singleton.getInstance()
        singleton.transition_name = "transition_diamond"
        singleton.transition_flag = Helper.randomRangeInt(0, 7)
        transition.setUniform("flag.value", singleton.transition_flag)
        this.tweens.add({ targets: transition.uniforms.progress, value: 1.0, ease: 'Linear', duration: 1000,
            onComplete: () => { this.scene.start(transition_to) }
        })
    }
    
    button_hide()
    {
        this.help_container.visible = false
        this.control = false
        this.rectangle.y = -100
        for(var i = 0; i < this.button.length; i++)
        {
            this.button[i].x = -500
            this.button[i].idle()
        }
    }

    button_show()
    {
        this.help_container.visible = true
        this.Selected_Button = 0
        this.button[this.Selected_Button].focus()
        for(var i = 0; i < this.button.length; i++)
        {
            this.button[i].x = -500
            this.tweens.add({ targets: this.button[i], x: this.cameras.main.width * 0.5, ease: 'Power1', duration: 800, delay: 150*i,})
        }
        this.time.addEvent({ delay: 1000 + 150*this.button.length, callback: () => { 
            this.control = true
        }})
    }

    preload() 
    {
        this.load.image("button_focus", "assets/menu_button_focus.png")
        this.load.image("button_idle", "assets/menu_button_idle.png")
        this.load.image("menu_bg_clouds", "assets/menu/clouds.png")
        this.load.image("menu_bg_mountains", "assets/menu/mountains.png")
        this.load.image("menu_bg_grass2", "assets/menu/grass2.png")
        this.load.image("menu_bg_grass1", "assets/menu/grass1.png")
    }

    create() 
    {
        //this.sound.stopAll()
        //this.sound.play('mus_menu')

        this.bg_clouds = this.add.tileSprite(0, -8, this.cameras.main.width, 160, "menu_bg_clouds").setOrigin(0)
        this.bg_mountains = this.add.tileSprite(0, 80, this.cameras.main.width, 112, "menu_bg_mountains").setOrigin(0)
        this.bg_grass2 = this.add.tileSprite(0, 120, this.cameras.main.width, 50, "menu_bg_grass2").setOrigin(0)
        this.bg_grass1 = this.add.tileSprite(0, 144, this.cameras.main.width, 25, "menu_bg_grass1").setOrigin(0)
        this.rectangle = this.add.rectangle(0, -100, this.cameras.main.width, 22, 0xffffff).setOrigin(0, 0.65)

        this.button = []

        this.button.push(new MenuButton(this, -500, this.cameras.main.height * 0.55, "PLAY", () => { 
            this.control = false
            this.time.addEvent({ delay: 1000, callback: () =>  { this.transitioning("Scene_Level1") } })
        }))

        this.button.push(new MenuButton(this, -500, this.cameras.main.height * 0.72, "STAGE 2", () => { 
            this.control = false
            this.time.addEvent({ delay: 1000, callback: () =>  { this.transitioning("Scene_Menu") } })
        }))

        this.button.push(new MenuButton(this, -500, this.cameras.main.height * 0.89, "CREDIT", () => {
            this.state = "Credits"
            this.title.visible = false
            this.credit_container.visible = true
            this.button_hide()
        }))

        this.title = this.add.text(this.cameras.main.width * 0.5, 40, "Adventure Trail", {fontFamily: 'monospace', fontSize: 32, fontStyle: 'bold', color: '#ffffff', align: 'center' }).setOrigin(0.5)

        this.cursors = this.input.keyboard.createCursorKeys()
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)

        this.credit_container = this.add.container(0, 0)
        this.help_container = this.add.container(0, 0)

        this.help_container.add(this.add.text(315, 150, [
            "Control:",
            "Move - Arrow",
            "Select - Z",
            "Jump - Z",
            "Attack - X",
            "Slide - C",
            "Air Jump - Z+C" ], { color: 'black', fontSize: 12, align: 'right' }).setOrigin(1, 1))

        this.add.text(5, 5, '', { fontSize: '16px', color: '#f00' })

        this.credit_container.add(this.add.text(10, 50, [
            "Graphics:",
            "8-BitSpider",
            "foxlybr.itch.io",
            "rvros.itch.io",
            "@ansimuz",
            "@bakudas",
            "@untiedgames", ], { color: 'black'}))

        this.credit_container.add(this.add.text(310, 22, [
            "Stage Music: Eric Matyas",
            "www.soundimage.org", ], { color: 'black', align: 'right' }).setOrigin(1, 0))

        this.credit_container.add(this.add.text(310, 157, [
            "Press Z to back",
            "to title", ], { color: 'lime', align: 'right' }).setOrigin(1, 1))

        this.credit_container.visible = false
        this.button_show()
        const singleton = Singleton.getInstance()
        if (singleton.transition_name)
        {
            const transition = this.add.shader(singleton.transition_name, 0, 0, this.cameras.main.width, this.cameras.main.height).setOrigin(0)
            transition.setUniform("inversion.value", 1)
            transition.setUniform("flag.value", singleton.transition_flag)
            singleton.transition_name = ""
            this.tweens.add({ targets: transition.uniforms.progress, value: 1.0, ease: 'Linear', duration: 1000,
                onComplete: () => { transition.destroy() }
            })
        }
    }

    update()
    {
        this.button.forEach((button) => { button.update() })
        if(this.rectangle.alpha <= 0.25)
            this.rectangle.setAlpha(Phaser.Math.FloatBetween(0.05, 0.25))

        this.bg_clouds.tilePositionX += 0.1
        this.bg_mountains.tilePositionX += 0.125
        this.bg_grass2.tilePositionX += 0.2
        this.bg_grass1.tilePositionX += 0.25

        switch(this.state)
        {
            case "Credits":
                if (Phaser.Input.Keyboard.JustDown(this.keyZ))
                {
                    this.state = ""
                    this.title.visible = true
                    this.credit_container.visible = false
                    this.button_show()
                }
                break

            default:
                if(this.control)
                {
                    let direction = Number(Phaser.Input.Keyboard.JustDown(this.cursors.down)) - Number(Phaser.Input.Keyboard.JustDown(this.cursors.up))
                    if(direction != 0)
                    {
                        let new_selected_button = Phaser.Math.Clamp(this.Selected_Button + direction, 0, this.button.length - 1)
                        if(new_selected_button != this.Selected_Button)
                        {
                            this.button[this.Selected_Button].idle()
                            this.Selected_Button = new_selected_button
                            this.button[this.Selected_Button].focus()
                            this.sound.play('snd_menu_switch')
                        }
                    }
                    else if (Phaser.Input.Keyboard.JustDown(this.keyZ))
                    {
                        this.sound.play('snd_menu_select')
                        let button = this.button[this.Selected_Button]
                        this.rectangle.y = button.y
                        this.rectangle.setAlpha(1)
                        this.tweens.add({ targets: this.rectangle, alpha: 0.2, ease: 'Linear', duration: 100, })
                        button.action()
                    }
                }
                break
        }
    }

}
