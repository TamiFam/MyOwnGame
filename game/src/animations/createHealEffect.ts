export function createHealEffectAnimations(scene: Phaser.Scene) {
    scene.anims.create({
        key: 'healEffect',
        frames: scene.anims.generateFrameNumbers('healEffect', { start: 38, end:49 }),
        frameRate: 16,
        repeat: 0   
        
      });
  }
  