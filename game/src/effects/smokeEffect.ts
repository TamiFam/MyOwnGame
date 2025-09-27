import type { PlayerController } from "../scenes/Player/PlayerController";

export function smokeEffect(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    controller: PlayerController,
    onComplete: () => void,
    
){
   
    const effect = scene.add.sprite(player.x, player.y -70, 'Smoke1');
    
effect.setOrigin(0.5, 0.5);
effect.setScale(1.5);
effect.setDepth(10);
effect.play('Smoke1');
effect.on('animationcomplete', () => {
  effect.destroy();
 
  onComplete()

})
}

