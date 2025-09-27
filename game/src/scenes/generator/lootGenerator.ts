// src/game/generator/lootGenerator.ts
import type { Scene } from 'phaser';
import type { ItemManager } from '../manager/ItemManager';

const LOOT_TABLE = [
  { key: 'sword', chance: 0.3, minAmount: 1, maxAmount:2,offset:90 },
  { key: 'sword11', chance: 0.2, minAmount: 1, maxAmount:2,offset:90 },
   {key: 'coin', chance: 1, minAmount: 5, maxAmount: 15, offset:35}
];
const LOOT_ENEMY = [
  { key: 'sword', chance: 0.01, minAmount: 1, maxAmount:2, },
  { key: 'sword11', chance: 0.01, minAmount: 1, maxAmount:1, },
  {key: 'coin', chance: 1, minAmount: 5, maxAmount: 15, }
];

const LOOT_BOSS_ENEMY = [
  {key: 'coin', chance: 1, minAmount: 60, maxAmount: 70, }
]

export function generateLoot(
  scene: Scene,
  centerX: number,
  centerY: number,
  itemManager: ItemManager,
  lootType: number,      // 1 -враги   0 -- сунудук
) {
  // Проходим по таблице и выбираем предметы с шансом
  if(lootType === 0){
    LOOT_TABLE.forEach((loot) => {
      if (Math.random() <= loot.chance) {
         const count = Phaser.Math.Between(loot.minAmount, loot.maxAmount)
         for( let i =0; i< count; i++){
          const offsetX = Phaser.Math.Between(-loot.offset, loot.offset);
          const offsetY = Phaser.Math.Between(-loot.offset, loot.offset);
          const x = centerX + offsetX;
          const y = centerY + offsetY;
          
    
          const item = scene.physics.add.sprite(x, y, loot.key).setDepth(5);
          animLoot(item,y)
          item.setData('pickupReady', true);

          item.setData('type', 'loot');
          itemManager.addExistingItem(item);
         }
        
      }
    });
  } else {
    if(lootType === 1) {
      LOOT_ENEMY.forEach((loot) => {
        if (Math.random() <= loot.chance) {
           const count = Phaser.Math.Between(loot.minAmount, loot.maxAmount)
           for( let i =0; i< count; i++){
            // const offsetX = Phaser.Math.Between(-loot.offset, loot.offset);
            // const offsetY = Phaser.Math.Between(-100, 100);
            const x = centerX 
            const y = centerY
      
            const item = scene.physics.add.sprite(x, y, loot.key).setDepth(5);
            // animLoot(item,y)
            item.body.allowGravity = false;
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 3); // угол от 0 до 2π
            const speed = Phaser.Math.Between(100, 300);
            
            // УСТАНАВЛИВАЕМ СКОРОСТЬ НАПРАВЛЕНИЯ
            scene.physics.velocityFromRotation(angle, speed, item.body.velocity);
            
            // ПОВЕДЕНИЕ
            item.setBounce(0.6);
            item.setCollideWorldBounds(true);
            item.setDamping(true);
            item.setDrag(0.3);
            
            // PICKUP задержка
            item.setData('magnet', false); // по умолчанию не притягивается
            item.setData('type', 'loot');
            item.setData('pickupReady', false);
            scene.time.delayedCall(300, () => {
            
              item.setData('pickupReady', true);
            });
            scene.time.delayedCall(2100, ()=> {
              item.setData('magnet', true); 
            })

            itemManager.addExistingItem(item);
           }
          
        }
      });
    }
  }
  if(lootType === 2) {
    LOOT_BOSS_ENEMY.forEach((loot) => {
      if (Math.random() <= loot.chance) {
         const count = Phaser.Math.Between(loot.minAmount, loot.maxAmount)
         for( let i =0; i< count; i++){
          // const offsetX = Phaser.Math.Between(-loot.offset, loot.offset);
          // const offsetY = Phaser.Math.Between(-100, 100);
          const x = centerX 
          const y = centerY
    
          const item = scene.physics.add.sprite(x, y, loot.key).setDepth(5);
          // animLoot(item,y)
          item.body.allowGravity = false;
          const angle = Phaser.Math.FloatBetween(0, Math.PI * 3); // угол от 0 до 2π
          const speed = Phaser.Math.Between(100, 300);
          
          // УСТАНАВЛИВАЕМ СКОРОСТЬ НАПРАВЛЕНИЯ
          scene.physics.velocityFromRotation(angle, speed, item.body.velocity);
          
          // ПОВЕДЕНИЕ
          item.setBounce(0.6);
          item.setCollideWorldBounds(true);
          item.setDamping(true);
          item.setDrag(0.3);
          
          // PICKUP задержка
          item.setData('magnet', false); // по умолчанию не притягивается
          item.setData('type', 'loot');
          item.setData('pickupReady', false);
          scene.time.delayedCall(300, () => {
          
            item.setData('pickupReady', true);
          });
          scene.time.delayedCall(2100, ()=> {
            item.setData('magnet', true); 
          })

          itemManager.addExistingItem(item);
         }
        
      }
    });
  }

  function animLoot(item:Phaser.Physics.Arcade.Sprite,y:number) {
    scene.tweens.add({
      targets: item,
      y: y - 5,
      scale: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
  });
  }
  
 
}
export function updateLootMagnet(
 
  player: Phaser.GameObjects.Sprite,
  itemManager: ItemManager,
  pickupDistance = 50,
  magnetSpeed = 1550,
  magnetActivationRadius =100,
) {
  itemManager.items.forEach((item) => {
    if (item.getData('magnet')) {
      // console.log(player.x, player.y)
      const dx = player.x - item.x;
      const dy = player.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < magnetActivationRadius ) {
       if(item.getData('pickUpReady') && dist < pickupDistance) {
        itemManager.pickupItem(item);
       }  else {
        // Движение к игроку
        item.body!.velocity.x = (dx / dist) * magnetSpeed;
        item.body!.velocity.y = (dy / dist) * magnetSpeed;
       }
      } else {
        item.body!.velocity.x = 0;
        item.body!.velocity.y = 0;
      }
    
    }
  });
}
  
 


