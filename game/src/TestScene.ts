import Phaser from 'phaser';

export default class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestScene' });
  }

  create() {
    const testText = this.add.text(400, 300, 'Нажми меня', {
      fontSize: '32px',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 10 },
    }).setInteractive({ useHandCursor: true });

    testText.on('pointerdown', () => {
      console.log('Тестовая кнопка была нажата!');
    });
  }
}
