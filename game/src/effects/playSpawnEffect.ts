import type { PlayerController } from "../scenes/Player/PlayerController";

export function playSpawnEffect(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    controller: PlayerController,
    onComplete: () => void,
    
){
    player.setVisible(false);
    const effect = scene.add.sprite(player.x, player.y -70, 'Explosion_two_colors1');
    controller.speed = 50
effect.setOrigin(0.5, 0.5);
effect.setScale(1.5);
effect.setDepth(10);
effect.play('Explosion_two_colors1');
effect.on('animationcomplete', () => {
  effect.destroy();
  player.setVisible(true);
  onComplete()

})
}




