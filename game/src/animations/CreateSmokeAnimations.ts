export function createSmokeAnimations(scene: Phaser.Scene) {
    scene.anims.create({
      key: 'Smoke1',
      frames: [
        { key: 'Smoke1' },
        { key: 'Smoke2' },
        { key: 'Smoke3' },
        { key: 'Smoke4' },
        { key: 'Smoke5' },
        { key: 'Smoke6' },
    
      ],
      frameRate: 20,
      repeat: 0,
    });
  }
  