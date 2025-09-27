
export function createItemAnimations(scene: Phaser.Scene) {
scene.anims.create({
    key: 'coin',
    frames: scene.anims.generateFrameNumbers('coin', { start: 0, end: 11 }),
    frameRate: 11,
    repeat: 0
    
  })
}