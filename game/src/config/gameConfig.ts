import 'phaser';
import type { Types } from 'phaser';
import GameScene from '../scenes/GameScene';
import TestScene from '../TestScene';

export const GameConfig: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT, // Подгоняет размер под экран
        autoCenter: Phaser.Scale.CENTER_BOTH, // Центрирует игру
        width: 1920,
        height: 930,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
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
