

export class CoinUI {
// private coinText: Phaser.GameObjects.Text
private scene: Phaser.Scene;
private coinText!: Phaser.GameObjects.Text
    constructor
    (
        scene: Phaser.Scene,
    ){
        this.scene = scene;
        

    }
public updateCoin(amount: number) {
    if(!this.coinText) {
    this.coinText  = this.scene.add.text(920,50,`Монеты: ${amount}`, {
        fontSize: '22px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setScrollFactor(0)  // чтобы текст не двигался с камерой
      .setDepth(2000); // Вертикальное выравнивание текста
    } else {
        this.coinText.setText(`Монеты: ${amount}`)
    }
}
}



