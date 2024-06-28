import * as Phaser from 'phaser'

export default class InputKey
{
	private key: Phaser.Input.Keyboard.Key

	constructor(key: Phaser.Input.Keyboard.Key)
    {
		this.key = key
    }

	get up()
	{
		return Number(this.key.isUp)
	}

	get down()
	{
		return Number(this.key.isDown)
	}

	get pressed()
	{
		return Number(Phaser.Input.Keyboard.JustDown(this.key))
	}

	get released()
	{
		return Number(Phaser.Input.Keyboard.JustUp(this.key))
	}
}