import 'phaser'; // Основной импорт Phaser
import type { Types } from 'phaser'; // Добавляем ключевое слово 'type'
import GameScene from '../scenes/GameScene';
import TestScene from '../TestScene';

export const GameConfig: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 930 ,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,  //false  true
        }
    },
    scene: [GameScene],
    input: {
        mouse: true,
        touch: true,
        gamepad: false,
        keyboard: true
      },
};