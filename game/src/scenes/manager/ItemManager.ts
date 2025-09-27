import type { PlayerController } from "../Player/PlayerController";

export class ItemManager {
  private scene: Phaser.Scene;
  private PickUpItemSound!: Phaser.Sound.BaseSound
  public itemsGroup: Phaser.Physics.Arcade.Group;
    items: Phaser.GameObjects.Sprite[] =[]
    constructor( scene: Phaser.Scene, private player: Phaser.Physics.Arcade.Sprite, private controller: PlayerController){
      
      this.scene = scene;
      this.itemsGroup = this.scene.physics.add.group();
     
      this.PickUpItemSound = scene.sound.add('PickUpItem') 
    }
    addExistingItem(item: Phaser.Physics.Arcade.Sprite) {
      
        this.items.push(item);
        
        // console.log(item)
        this.scene.physics.add.overlap(this.player, item, () => {
          if (!item.getData('pickupReady')) return;
          item.setData('magnet', true);
          // console.log(item.getData('magnet'))
          
          this.pickupItem(item);
        });
      }
      addExistingItem1(item: Phaser.Physics.Arcade.Sprite) {
      
        this.items.push(item);
        
       
        this.scene.physics.add.overlap(this.player, item, () => {
          
          
        
          
          this.pickupItem(item);
        });
      }
      
      spawnItem(x: number, y: number, texture: string) {
        const item = this.itemsGroup.create(x, y, texture) as Phaser.Physics.Arcade.Sprite;
        item.setImmovable(true);
        item.setDepth(2);
        return item;
      }
   public pickupItem(item: Phaser.GameObjects.Sprite) {
    
      this.PickUpItemSound.play({volume: 1})
      if(item.texture.key === 'coin')  {
        this.controller.increaseeCoin();
      }
      
   
    

   
  //  console.log(item)
    item.destroy()

    this.items= this.items.filter(i => i !== item)
    
     

   }

}