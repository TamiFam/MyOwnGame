import { CHUNK_SIZE, TILE_SIZE } from "../../constants/World";
import { itemGenerator } from "../generator/itemGenerator";
import { generateLoot } from "../generator/lootGenerator";
import type { ItemManager } from "./ItemManager";




export class ColliderObjectManager {
    objects: Phaser.Physics.Arcade.Sprite[] = [];
    private chestOpenSound!: Phaser.Sound.BaseSound
    
  
    constructor(private scene: Phaser.Scene, private player: Phaser.Physics.Arcade.Sprite,private itemManager: ItemManager ) {

        this.itemManager
        this.chestOpenSound = scene.sound.add('chestOpen')
    }
  
    addObject(obj: Phaser.Physics.Arcade.Sprite) {
      
      obj.setImmovable(true); // Чтобы объекты не двигались от столкновений
      this.scene.physics.add.collider(this.player, obj);
      this.objects.push(obj);
     
      
      const label = this.scene.add.text(obj.x, obj.y - 42, 'Нажмите E, чтобы открыть', {
        fontSize: '12px',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: {x: 5, y: 2},
      });
      label.setDepth(1001)
      label.setOrigin(0.5);
      label.setVisible(false);
      obj.setData('label', label);

      obj.setData('opened', false);
    
    }
    openChest(chest: Phaser.Physics.Arcade.Sprite) {
        if (chest.getData('opened')) return; // Уже открыт — не трогаем
        
        chest.setData('opened', true);
        
        chest.setTexture('chest1opn');
        
        this.chestOpenSound.play({volume: 0.7})
    
        const chestX = chest.x;
          const chestY = chest.y;
        // Вызов генерации предметов рядом с сундуком
        generateLoot(this.scene, chestX,chestY, this.itemManager ,0)
        console.log(`Предметы сгеенерировались на  x${chestX} y${chestY} `)
        
        const label:Phaser.GameObjects.Text | undefined  = chest.getData('label')
        if(label){
          label.destroy()
        }
        
      
        this.scene.time.delayedCall(5000, ()=> {
            const index = this.objects.indexOf(chest);
            if (index !== -1) {
              this.objects.splice(index, 1);
            }
            chest.destroy();
        })
        
    
    }
    update() {
      // Проходимся по всем объектам (сундукам)
      this.objects.forEach(obj => {
        
          if (obj.getData('opened')) return; // Если сундук уже открыт - не показываем
          
          const label: Phaser.GameObjects.Text | undefined = obj.getData('label');
          if (!label) return;
          
          // Проверяем расстояние до игрока
          const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y);
          
          if (distance < 100) {  // например, 50 пикселей радиус
              label.setVisible(true);
          } else {
              label.setVisible(false);
          }
      });
  }

  }
  