export function healEffect(scene: Phaser.Scene, target: Phaser.GameObjects.Sprite, onComplete?: () => void) {
  const effect = scene.add.sprite(target.x, target.y, 'healEffectAnim').setScale(1.8);
  effect.play('healEffect');

  // Привязываем эффект к цели каждый кадр
  const updateEffectPosition = () => {
    effect.setPosition(target.x, target.y -30);
  };

  // Обновляем позицию на каждом кадре
  scene.events.on('update', updateEffectPosition);

  // Когда анимация завершится — удаляем эффект и отписываемся
  effect.on('animationcomplete', () => {
    effect.destroy();
    scene.events.off('update', updateEffectPosition);
    onComplete?.();
  });
}