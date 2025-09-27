import Phaser from 'phaser';

export function createPlayerAnimations(scene: Phaser.Scene) {
  scene.anims.create({
    key: 'run',
    frames: scene.anims.generateFrameNumbers('hero_run', { start: 0, end: 9 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'idle',
    frames: scene.anims.generateFrameNumbers('hero_idle', { start: 0, end: 9 }),
    frameRate: 5,
    repeat: -1,
  });
  scene.anims.create({
    key: 'dash',
    frames: scene.anims.generateFrameNumbers('hero_dash', {start: 1, end: 3}),
    frameRate: 3,
    repeat: -1
  })
  scene.anims.create({
    key: 'attack',
    frames: scene.anims.generateFrameNumbers('hero_attack', {start: 1, end: 4}),
    frameRate: 14,
    repeat: 0
  })
  scene.anims.create({
    key: 'crouch',
    frames: scene.anims.generateFrameNumbers('hero_crouch', {start: 1, end: 8}),
    frameRate: 8,
    repeat: 0
  })
  scene.anims.create({
    key: 'attack2',
    frames: scene.anims.generateFrameNumbers('hero_attack2', {start: 1, end: 6}),
    frameRate: 14,
    repeat: 0
  })


  

  // Можно добавить другие анимации здесь (прыжок, атака и т.д.)
}
