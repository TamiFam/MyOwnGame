export function createExplosionAnimations(scene: Phaser.Scene) {
  scene.anims.create({
    key: 'Explosion_two_colors1',
    frames: [
      { key: 'Explosion_two_colors1' },
      { key: 'Explosion_two_colors2' },
      { key: 'Explosion_two_colors3' },
      { key: 'Explosion_two_colors4' },
      { key: 'Explosion_two_colors5' },
      { key: 'Explosion_two_colors6' },
      { key: 'Explosion_two_colors7' },
      { key: 'Explosion_two_colors8' },
      { key: 'Explosion_two_colors9' },
      { key: 'Explosion_two_colors10' },
    ],
    frameRate: 15,
    repeat: 0,
  });
}
