import Phaser from 'phaser';
import { EnemyController } from './EnemyController';
import { Health } from '../GeneralContent/Health';
import { HealthBar } from '../GeneralContent/healthBar';
import { PlayerController } from '../Player/PlayerController';
import { LevelManager } from '../manager/levelManager';
import { ItemManager } from '../manager/ItemManager';
import { TILE_SIZE, CHUNK_SIZE} from '../../constants/World';
type EnemyType = 'warrior' | 'skeleton' | 'gorgona';

interface SpawnedEnemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  controller: EnemyController;
}

export function spawnEnemiesInChunkLogic(
  scene: Phaser.Scene,
  chunkX: number,
  chunkY: number,
  player: Phaser.Physics.Arcade.Sprite,
  playerController: PlayerController,
  levelManager: LevelManager,
  itemManager: ItemManager
): SpawnedEnemy[] | null {
  
  const CHUNK_WORLD_SIZE = TILE_SIZE * CHUNK_SIZE;

  const chunkKey = `${chunkX}:${chunkY}`;
  const spawnChancePercent = 35;

  if (Phaser.Math.Between(1, 100) > spawnChancePercent) {
    return null; // не спавним
  }

  const enemyTypes: EnemyType[] = ['warrior', 'skeleton', 'gorgona'];
  const enemies: SpawnedEnemy[] = [];

  for (let i = 0; i < 1; i++) {
    
   
    
    const chunkStartX = chunkX * CHUNK_WORLD_SIZE;
    const chunkStartY = chunkY * CHUNK_WORLD_SIZE;
    
    const spawnX = chunkStartX + CHUNK_WORLD_SIZE / 2;
    const spawnY = chunkStartY + CHUNK_WORLD_SIZE / 2;
    
    // const spawnX = Phaser.Math.Clamp(rawSpawnX, player.x - 200, player.x + 200);
    // const spawnY = Phaser.Math.Clamp(rawSpawnY, player.y - 200, player.y + 200);
    enemyTypes.forEach((type, index) => {
      const x = spawnX + index * 150;
      const y = spawnY + index * 150;
      const chanceSpawn = getRespawnChance(type)
      if (chanceSpawn > Phaser.Math.FloatBetween(0,1)) {
        const sprite = scene.physics.add.sprite(x, y, getTextureKey(type));
        sprite.setBounce(0);
        sprite.setCollideWorldBounds(true);
        sprite.setDepth(5);
        sprite.setScale(getScale(type));
  
        const size = getBodySize(type);
        const offset = getBodyOffset(type);
        sprite.body?.setSize(size.width, size.height).setOffset(offset.x, offset.y);
  
        sprite.play(getAnimationKey(type));
  
        const health = new Health(type);
        const healthBar = new HealthBar(scene, sprite, 50, 6, -50, health);
        const controller = new EnemyController(scene, sprite, player, health, healthBar, playerController, levelManager, itemManager, type);
        console.log('Player pos:', player.x, player.y);
        console.log(`${type} spawned at (${x}, ${y})`);
        enemies.push({ sprite, controller });
      }});
      }

      
  

  return enemies;
}

function getTextureKey(type: EnemyType): string {
  switch (type) {
    case 'warrior': return 'enemy';
    case 'skeleton': return 'enemy-skeleton-walk';
    case 'gorgona': return 'enemy-gorgona-walk';
  }
}

function getAnimationKey(type: EnemyType): string {
  switch (type) {
    case 'warrior': return 'warrior_walk_down';
    case 'skeleton': return 'skeleton_walk';
    case 'gorgona': return 'gorgona_walk';
  }
}

function getScale(type: EnemyType): number {
  switch (type) {
    case 'warrior': return 3;
    case 'skeleton': return 1;
    case 'gorgona': return 0.8;
  }
}

function getBodySize(type: EnemyType): { width: number; height: number } {
  switch (type) {
    case 'warrior': return { width: 20, height: 20 };
    case 'skeleton': return { width: 60, height: 60 };
    case 'gorgona': return { width: 60, height: 60 };
  }
}

function getBodyOffset(type: EnemyType): { x: number; y: number } {
  switch (type) {
    case 'warrior': return { x: 20, y: 20 };
    case 'skeleton': return { x: 33, y: 46 };
    case 'gorgona': return { x: 33, y: 46 };
  }
}

function getRespawnChance(type: EnemyType) {
  switch (type) {
    case 'warrior': return 0.1;
    case 'skeleton': return 0.1;
    case 'gorgona': return 0.05;
  }
}

// private spawnEnemiesInChunk(chunkX: number, chunkY: number) {
//   const CHUNK_WORLD_SIZE = CHUNK_SIZE * TILE_SIZE;
//   const chunkKey = `${chunkX}:${chunkY}`;

//   if (this.enemiesByChunk.has(chunkKey)) {
//     // Враги для этого чанка уже созданы
//     return;
//   }
//   // Шанс, что в этом чанке будут враги (например 20%)
// const spawnChancePercent = 20;
// if (Phaser.Math.Between(1, 100) > spawnChancePercent) {
//   // console.log(`В этом чанке будет враг: ${chunkX}:${chunkY}`);
//   // Не спавним врагов в этом чанке — оставляем пустым
//   this.enemiesByChunk.set(chunkKey, []); // Чтобы не спавнилось повторно
//   return;
// }
// // console.log(`В этом чанке будет враг: ${chunkX}:${chunkY}`);
//   const enemyCountPerChunk = 1;
//   const enemies: Phaser.Physics.Arcade.Sprite[] = [];

//   for (let i = 0; i < enemyCountPerChunk; i++) {
//     const offsetX = Phaser.Math.Between(0, CHUNK_WORLD_SIZE);
//     const offsetY = Phaser.Math.Between(0, CHUNK_WORLD_SIZE);
  
//     const enemyWarriorWorldX = chunkX * CHUNK_WORLD_SIZE + offsetX;
//     const enemyWarriorWorldY = chunkY * CHUNK_WORLD_SIZE + offsetY;
  
//     //🎭 Создаём врага-warrior
//     const warrior = this.physics.add.sprite(enemyWarriorWorldX, enemyWarriorWorldY, 'enemy');
//     // console.log('🎃 воин создан:', warrior);
    
//     warrior.setBounce(0);
//     warrior.setCollideWorldBounds(true);
//     warrior.setScale(3);
//     warrior.setDepth(1);
//     warrior.body.setSize(20, 20);
//     warrior.body.setOffset(20, 20);
//     warrior.play('warrior_walk_down');
  
//     const warriorHealth = new Health('warrior')
//     const warriorHealthBar = new HealthBar(this, warrior,50,6,-50,warriorHealth  );
//     const enemyController = new EnemyController(this, warrior, this.player, warriorHealth,warriorHealthBar, this.controller, this.levelManager, this.itemManager,'warrior',);
  
//     // this.addPlayerEnemyColliders(warrior);
//     this.addEnemyColliders(warrior);
  
//     this.enemyControllers.push(enemyController);
//     this.enemies.push(warrior);


//     const shouldSpawn = Phaser.Math.Between(1, 100) <= spawnChancePercent;
//     if (!shouldSpawn) return;

//     //Создаем скелета
    
//       const skeleton = this.physics.add.sprite(enemyWarriorWorldX + 150, enemyWarriorWorldY + 150, 'enemy');
//       // console.log('🎃 Скелет создан:', skeleton);
//       skeleton.setBounce(0);
//       skeleton.setCollideWorldBounds(true);
//       // skeleton.setOrigin(0,1)
//       skeleton.setDepth(5);
//       skeleton.body.setSize(60, 60); // Узкий, но не низкий
// skeleton.body.setOffset(33, 46); // Смещение вниз
//       skeleton.play('skeleton_walk'); // если есть другая анимация - замени

//       const skeletonHealth = new Health('skeleton');
//       const skeletonHealthBar = new HealthBar(this, skeleton,50,6,-50,skeletonHealth );
//       const skeletonController = new EnemyController(this, skeleton, this.player,skeletonHealth, skeletonHealthBar, this.controller, this.levelManager, this.itemManager ,'skeleton');
          
//       // this.addPlayerEnemyColliders(skeleton);
//       this.addEnemyColliders(skeleton);
    
//       this.enemyControllers.push(skeletonController);
//       this.enemies.push(skeleton);

//       // Горгона
     
    
//       const gorgona = this.physics.add.sprite(enemyWarriorWorldX + 250, enemyWarriorWorldY + 250, 'gorgona');
//       // console.log('🎃 Скелет создан:', skeleton);
//       gorgona.setBounce(0);
//       gorgona.setCollideWorldBounds(true);
//       // skeleton.setOrigin(0,1)
//       gorgona.setDepth(5);
//       gorgona.setScale(0.8);
//       gorgona.body.setSize(60, 60); // Узкий, но не низкий
//       gorgona.body.setOffset(33, 46); // Смещение вниз
//       gorgona.play('gorgona_walk'); // если есть другая анимация - замени

//       const gorgonaHealth = new Health('gorgona');
//       const gorgonaHealthBar = new HealthBar(this, gorgona,50,6,-50,gorgonaHealth );
//       const gorgonaController = new EnemyController(this, gorgona, this.player,gorgonaHealth, gorgonaHealthBar, this.controller, this.levelManager, this.itemManager ,'gorgona');
          
//       // this.addPlayerEnemyColliders(skeleton);
//       this.addEnemyColliders(gorgona);
    
//       this.enemyControllers.push(gorgonaController);
//       this.enemies.push(gorgona);
    
//       enemies.push( warrior,skeleton,gorgona); // сохраняем в чанке
//       this.enemiesByChunk.set(chunkKey, enemies)
    
//     }
    
    
    
    
// }
