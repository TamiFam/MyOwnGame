export function createLevelUpAnimation(scene: Phaser.Scene) {
    scene.anims.create({
      key: 'levelUp',
      frames: [
        { key: 'levelUp1' },
        { key: 'levelUp2' },
        { key: 'levelUp3' },
        { key: 'levelUp4' },
        { key: 'levelUp5' },
        { key: 'levelUp6' },
        { key: 'levelUp7' },
        { key: 'levelUp8' },
        { key: 'levelUp9' },
        { key: 'levelUp10' },
        { key: 'levelUp11' },
        { key: 'levelUp12' },
    
      ],
      frameRate: 10,
      repeat: 0,
    });
  }