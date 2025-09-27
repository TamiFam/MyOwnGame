import Phaser from 'phaser';
import { TILE_SIZE, CHUNK_SIZE, VIEW_DISTANCE } from '../constants/World';
import { createPlayerAnimations } from './Player/PlayerAnimations';
import { PlayerController } from './Player/PlayerController';
import { generateChunk } from './generator/ChunkGenerator';
import { EnemyController } from './Enemy/EnemyController';
import { createEnemyAnimations } from './Enemy/EnemyAnimations';
import { HealthBar } from '../scenes/GeneralContent/healthBar'
import { ItemManager } from './manager/ItemManager';
import { playSpawnEffect } from '../effects/playSpawnEffect';
import { createExplosionAnimations } from '../animations/createExplosionAnimations';
import { createSmokeAnimations } from '../animations/CreateSmokeAnimations';
import {createLevelUpAnimation} from '../animations/createLevelUpAnimation'
import { ColliderObjectManager } from './manager/ColliderObjectManager';
import { LevelManager } from './manager/levelManager';
import { Health } from './GeneralContent/Health';
import { TextManager } from './manager/TextManager';
// import { SkillGenerator } from './generator/SkillGenerator';
import { SkillManager } from './manager/skillManager';
import  { SkillSelectionUI } from './Skills/SkillSelectionUI';
import { SkillGenerator } from './generator/SkillGenerator';
import { CharacteriscticManager } from './manager/characteristicManager';
import WebFont from 'webfontloader';
import { createHealEffectAnimations } from '../animations/createHealEffect';
import { createItemAnimations } from '../item/ItemAnimation';
import { updateLootMagnet } from './generator/lootGenerator';
import { CoinManager } from './manager/coinManager';
import { spawnEnemiesInChunkLogic } from './Enemy/spawnEnemiesInChunk ';


type ChunkKey = string;

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private keys!: Record<'up' | 'left' | 'down' | 'right' | 'dash' | 'crouch', Phaser.Input.Keyboard.Key>;
  private controller!: PlayerController;
  private loadedChunks: Map<ChunkKey, Phaser.Tilemaps.TilemapLayer> = new Map();
  private colliderObjectManager!: ColliderObjectManager;
  
  private chunkGraphics!: Phaser.GameObjects.Graphics;

  private enemiesByChunk: Map<ChunkKey, Phaser.Physics.Arcade.Sprite[]> = new Map();
  private enemies: Phaser.Physics.Arcade.Sprite[] = [];
  private enemyControllers: EnemyController[] = [];
private ColliderObjec: ColliderObjectManager[] =[]
  private levelManager!: LevelManager
  private textManager!: TextManager
  private coinManager!:  CoinManager 
  private skillManager!: SkillManager
  private characteristicManager!: CharacteriscticManager
  private SkillGenerator!: SkillGenerator
  private skillSelectionUI!: SkillSelectionUI;

  private playerHealthBar!: HealthBar;
  private enemyHealthBar!: HealthBar;
  private itemManager!: ItemManager;
  private lastHitTime = 0;
private HIT_COOLDOWN = 1000; // 1 секунда
  

  private fpsText!: Phaser.GameObjects.Text;
  private helpText!: Phaser.GameObjects.Text
  private readonly ACTIVATION_RADIUS = 3000;
  

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // this.loadWebFont();
    this.loadEffectsSprite();
    this.loadHeroSprites();
    this.loadTilesets();
    this.loadItems();
    this.loadSkillSound();
    this.loadEffectsImage();
    this.loadSounds();
    this.loadIcons();
    this.loadEnemies();
    this.loadItemsSound()
    
  }
  
  private loadHeroSprites() {
    const heroSprites = [
      { key: 'hero_idle', path: 'assets/hero/_Idle.png' },
      { key: 'hero_run', path: 'assets/hero/_Run.png' },
      { key: 'hero_jump', path: 'assets/hero/_Jump.png' },
      { key: 'hero_attack', path: 'assets/hero/_Attack.png' },
      { key: 'hero_attack2', path: 'assets/hero/_Attack2.png' },
      { key: 'hero_crouch', path: 'assets/hero/_CrouchWalk.png' },
    ];
  
    heroSprites.forEach(({ key, path }) => {
      this.load.spritesheet(key, path, { frameWidth: 120, frameHeight: 80 });
    });
  }
  
  private loadTilesets() {
    this.load.image('TX Tileset Grass', 'assets/map/TX Tileset Grass.png');
    this.load.image('TX Tileset Plants', 'assets/map/TX Plant.png');
    this.load.image('TX Tileset Forest', 'assets/map/TX Tileset Forest.png');
  }
  
  private loadItems() {
    this.load.image('sword', 'assets/Swords/Sword00.png');
    this.load.image('sword11', 'assets/Swords/Sword11.png');
    this.load.image('chest1', 'assets/effect/chest/chests-01.png');
    this.load.image('chest1opn', 'assets/effect/chestOpen/chests-01.png');
    this.load.image('chest1opn', 'assets/effect/chestOpen/chests-01.png');
    this.load.spritesheet('coin', 'assets/item/coin/coin.png', { frameWidth: 16, frameHeight: 16 });
  }
  
  private loadEffectsImage() {
    for (let i = 1; i <= 10; i++) {
      this.load.image(`Explosion_two_colors${i}`, `assets/effect/explosion/Explosion_two_colors${i}.png`);
    }
    for (let i = 1; i <= 6; i++) {
      this.load.image(`Smoke${i}`, `assets/effect/smoke/Smoke${i}.png`);
    }
    for (let i = 1; i <= 12; i++) {
      this.load.image(`levelUp${i}`, `assets/effect/levelup/frames/Priest_skill3_frame${i}.png`);
    }
  }
  private loadEffectsSprite(){
    this.load.spritesheet('healEffect', 'assets/effect/Heal/623.png', { frameWidth: 64, frameHeight: 64 });
  }
  
  private loadSounds() {
    const sounds = [
      { key: 'hitSound', path: 'assets/sounds/attackHit.wav' },
      { key: 'enemyDeath', path: 'assets/sounds/enemy/24_orc_death_spin.wav' },
      { key: 'heroDash', path: 'assets/sounds/hero/15_human_dash_2.wav' },
      { key: 'missHit', path: 'assets/sounds/hero/27_sword_miss_1.wav' },
      { key: 'agroSound', path: 'assets/sounds/enemy/08_human_charge_1.wav' },
      { key: 'soundtrack', path: 'assets/sounds/soundtrack.mp3' },
    ];
  
    sounds.forEach(({ key, path }) => {
      this.load.audio(key, path);
    });
  }

  private loadItemsSound() {
    const sounds = [
      { key: 'chestOpen', path: 'assets/sounds/item/01_chest_open_2.wav' },
      { key: 'levelup', path: 'assets/effect/levelup/FUI Holographic Interaction Radiate.wav' },
      { key: 'PickUpItem', path: 'assets/sounds/item/pickUpItem.wav' },
      
    ]
    sounds.forEach(({ key, path }) => {
      this.load.audio(key, path);
    });
  }
  private loadSkillSound() {
      const sounds =[
        { key: 'skillCooldown', path: 'assets/effect/skills/SkillsCooldown.wav' },
        { key: 'healSkillSound', path: 'assets/effect/Heal/healSoundSkill.mp3' },
      ]
      sounds.forEach(({key,path}) =>{
          this.load.audio(key,path)
      })
  }
  
  private loadIcons() {
    this.load.image('sound_on', 'assets/icons/sound_on.png');
    this.load.image('sound_off', 'assets/icons/sound_off.png');
    this.load.image('dash', 'assets/Swords/Sword03.png');
    this.load.image('heal', 'assets/effect/Heal/heal.png');
    this.load.image('plus', 'assets/icons/plus.png');
  }
  
  private loadEnemies() {
    this.load.spritesheet('enemy', 'assets/enemy/enemyWarrior/skull knight-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('enemy-skeleton', 'assets/enemy/enemySceleton/Idle/spr_NecromancerIdle_strip50.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('enemy-skeleton-walk', 'assets/enemy/enemySceleton/Walk/spr_NecromancerWalk_strip10.png', { frameWidth: 96, frameHeight:96 })
    this.load.spritesheet('enemy-skeleton-attack', 'assets/enemy/enemySceleton/Attack/spr_NecromancerAttackWithEffect_strip47.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('enemy-skeleton-hit-effect', 'assets/enemy/enemySceleton/Attack/spr_NecromancerAttackEffect_strip47.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('enemy-skeleton-death', 'assets/enemy/enemySceleton/Death/spr_NecromancerDeath_strip52.png', { frameWidth: 96, frameHeight: 96 })
    this.load.spritesheet('enemy-skeleton-idle', 'assets/enemy/enemySceleton/Idle/spr_NecromancerIdle_strip50.png', { frameWidth: 96, frameHeight: 96 })
    this.load.spritesheet('enemy-gorgona-idle', 'assets/enemy/Gorgon_2/Idle_2.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('enemy-gorgona-walk', 'assets/enemy/Gorgon_2/Walk.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('enemy-gorgona-attack', 'assets/enemy/Gorgon_2/Attack_1.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('enemy-gorgona-attack2', 'assets/enemy/Gorgon_2/Attack_2.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('enemy-gorgona-attack3', 'assets/enemy/Gorgon_2/Attack_3.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('enemy-gorgona-dead', 'assets/enemy/Gorgon_2/Dead.png', { frameWidth: 128, frameHeight: 128 })
    

  }
  
  create() {

    //Граффика для чанков
    this.chunkGraphics = this.add.graphics();
    this.chunkGraphics.setDepth(1000);
    // 🖱️ Отключаем контекстное меню по ПКМ
    this.input.mouse?.disableContextMenu();
  
    // 🎵 Загрузка и проигрывание фоновой музыки
    this.load.audio('soundtrack', 'assets/sounds/soundtrack.mp3');
    this.load.once('complete', () => {
      const music = this.sound.add('soundtrack', { volume: 0, loop: true });
      this.time.delayedCall(2000, () => {
        if (!music.isPlaying) music.play();
      });
    });
    this.load.start(); // ⬅️ Запускаем загрузку
  
    // 📍 Начальные координаты мира
    const worldStart = 100000;
    const playerStart = worldStart + 50000;
  
    // 🧍 Создание игрока
    this.player = this.physics.add.sprite(playerStart, playerStart, 'hero_idle', 0)
      .setOrigin(0.5, 1)
      .setScale(1.2)
      .setDepth(2);
      
    this.player.body!.setSize(40, 40);
    this.player.body!.setOffset(40, 40);
    this.player.setCollideWorldBounds(false);
    this.player.body!.pushable = false;   
    
    
    // this.player.setImmovable(true)
    
  
    // 🔊 Глобальная громкость
    this.sound.volume = 0.2;
  
  
  
    // 📷 Камера следует за игроком
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setLerp(0.1, 0.1);
    this.cameras.main.setBackgroundColor('#222');


    //Другой текст для игры
    // const textManager = new TextManager(this);


    // ⌨️ Управление
    this.keys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      dash: Phaser.Input.Keyboard.KeyCodes.SPACE,
      crouch: Phaser.Input.Keyboard.KeyCodes.SHIFT
    }) as Record<'up' | 'left' | 'down' | 'right' | 'dash' | 'crouch', Phaser.Input.Keyboard.Key>;
  
    // 🧩 Анимации
    createExplosionAnimations(this);
    createPlayerAnimations(this);
    createEnemyAnimations(this);
    createSmokeAnimations(this);
    createLevelUpAnimation(this);
    createHealEffectAnimations(this);
    createItemAnimations(this)

    // UI COIN
this.coinManager = new CoinManager(this)
this.coinManager.initUI()
  
    // 🧠 Контроллер игрока и уровня
    this.controller = new PlayerController(this,this.player, this.keys, this.enemies, this.enemyControllers,this.coinManager);
    


    this.skillManager = new SkillManager(this, this.controller);
    this.characteristicManager = new CharacteriscticManager(this)
this.levelManager = new LevelManager(this.controller, this.skillManager,this.characteristicManager);


    
    this.controller.levelHeroUi()
    this.controller.HeroCharacteristicUi()

      // 🎒 Менеджеры предметов и объектов
      this.itemManager = new ItemManager(this, this.player, this.controller);
      this.colliderObjectManager = new ColliderObjectManager(this, this.player, this.itemManager);

      
      this.skillManager.initializeSkills(['dash','heal']);
      this.skillManager.grantSkillPoint();
      

      this.characteristicManager.initializeCharct(['armor','health','damage'])
      this.characteristicManager.grantCharPoint()

      





this.input.keyboard!.on('keydown-F', () => {
  this.skillManager.toggleSkillSelectionUI()
});
 
    // 🌟 Эффект появления + стартовая скорость
    playSpawnEffect(this, this.player, this.controller, () => {
      this.controller.speed = 200;
    });
    
     //Перехватчик Tab
     this.input.keyboard!.on('keydown-TAB', (event:any) => {
      event.preventDefault();  // Блокируем стандартное поведение Tab
      this.characteristicManager.togglecharacteristicSelectioinUi()
      console.log('Tab key pressed!');

      
  });
 
  
  this.skillManager.toggleHeroSkillUI(),
 
    (this.input as any).enabledAttack = true;
    // 🖱️ Атака по клику мыши
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // ✅ Только если включена атака — атакуем
      if ((this.input as any).enabledAttack ?? true) {
        this.controller.attack(pointer.button);
      }
    });
  
    // 🗝️ Взаимодействие с сундуками по E
    this.input.keyboard!.on('keydown-E', () => {
      for (const chest of this.colliderObjectManager.objects) {
        if (chest.getData('type') !== 'chest') continue;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, chest.x, chest.y);
        if (dist < 80 && !chest.getData('opened')) {
          this.colliderObjectManager.openChest(chest);
          break; // Открыть только один
        }
      }
    });
  
    // 🌍 Границы мира
    this.physics.world.setBounds(worldStart, worldStart, 100000, 100000);
  
    // 🧱 Загрузка стартовых чанков и врагов
    this.updateChunks();
  
    // ⚔️ Коллизии между врагами (оптимизация позже)
    this.enemies.forEach((enemyA, indexA) => {
      for (let indexB = indexA + 1; indexB < this.enemies.length; indexB++) {
        const enemyB = this.enemies[indexB];
        this.physics.add.collider(enemyA, enemyB);
      }
    });
  
    // 📊 Отображение FPS
    this.fpsText = this.add.text(10, 10, '', {
      font: '16px Courier',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 5, y: 3 },
    }).setScrollFactor(0).setDepth(1000);
  
   // 📊 Посдсказки 
   this.helpText = this.add.text(1600, 10, '', {
    font: '13px Courier',
    color: '#00ff00',
    // backgroundColor: '#000000',
    padding: { x: 5, y: 3 },
  }).setScrollFactor(0).setDepth(1000);
  this.helpText.setText(`Нажми F чтобы открыть меню навыков\n Нажмите Tab чтобы открыть инвентарь`)
}
  private drawChunkBorders(centerChunkX: number, centerChunkY: number) {
    const CHUNK_WORLD_SIZE = CHUNK_SIZE * TILE_SIZE;
    this.chunkGraphics.clear();
  
    this.chunkGraphics.lineStyle(2, 0x9932CC, 0.2); 
  
    for (let y = -VIEW_DISTANCE; y <= VIEW_DISTANCE; y++) {
      for (let x = -VIEW_DISTANCE; x <= VIEW_DISTANCE; x++) {
        const chunkWorldX = (centerChunkX + x) * CHUNK_WORLD_SIZE;
        const chunkWorldY = (centerChunkY + y) * CHUNK_WORLD_SIZE;
        this.chunkGraphics.strokeRect(chunkWorldX, chunkWorldY, CHUNK_WORLD_SIZE, CHUNK_WORLD_SIZE);
      }
    }
  }
  // loadWebFont() {
  //   return new Promise<void>((resolve) => {
  //     WebFont.load({
  //       google: {
  //         families: ['Press Start 2P']
  //       },
  //       active: () => {
  //         console.log('Шрифт "Press Start 2P" загружен');
  //         resolve();
  //       }
  //     });
  //   });
  // }
  

  

  private addEnemyColliders(enemy: Phaser.Physics.Arcade.Sprite) {
    for (const layer of this.loadedChunks.values()) {
      this.physics.add.collider(enemy, layer);
    }
  }


//ВРАААААААГГГГГГГГГГГГГГГГГГГГГГИ
  private spawnEnemiesInChunk(chunkX: number, chunkY: number) {
  const chunkKey = `${chunkX}:${chunkY}`;
  if (this.enemiesByChunk.has(chunkKey)) return;

  const spawned = spawnEnemiesInChunkLogic(
    this,
    chunkX,
    chunkY,
    this.player,
    this.controller,
    this.levelManager,
    this.itemManager
  );

  if (!spawned) {
    this.enemiesByChunk.set(chunkKey, []);
    return;
  }

  this.enemiesByChunk.set(chunkKey, spawned.map(e => e.sprite));

  for (const { sprite, controller } of spawned) {
    this.enemies.push(sprite);
    this.enemyControllers.push(controller);
    this.addEnemyColliders(sprite);
    // this.addPlayerEnemyColliders(sprite);
  }
  
}

  private updateEnemies(time: number, delta: number) {
    this.enemyControllers.forEach(controller => {
      const enemy = controller['enemy'];
      const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);

      if (dist > this.ACTIVATION_RADIUS) {
        enemy.setActive(false);
        enemy.setVisible(false);
        if(enemy.body){
          enemy.body.enable = false
        }
      } else {
        enemy.setActive(true);
        enemy.setVisible(true);
        if(enemy.body){
          enemy.body.enable = true
        }
        controller.update(time, delta);
        
      }
    });
  }
  private handleHit:Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (playerObj, enemyObj) => {
    const player = playerObj as Phaser.Physics.Arcade.Sprite;
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;
  
    const now = this.time.now;
    if (now - this.lastHitTime < this.HIT_COOLDOWN) return;
    this.lastHitTime = now;
  
    if (!this.controller.getIsAttacking()) {
      // Игрок атакует — врагу наносится урон
    //   const enemyController = this.enemyControllers.find(ctrl => ctrl.getEnemy() === enemy);
    //   if (enemyController )  enemyController.takeDamage(10)
    // } else {
      // Иначе враг бьёт игрока
      this.controller.takeDamage(10);
    }
  }
  private addPlayerEnemyColliders(enemy: Phaser.Physics.Arcade.Sprite) {
    this.physics.add.collider(this.player, enemy);
    this.physics.add.overlap(this.player, enemy, this.handleHit, undefined, this);
  }
 
  update(time: number, delta: number) {
    this.controller.update();
    this.updateChunks();
    this.updateEnemies(time, delta);
    this.colliderObjectManager.update()

    this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
    // this.levelText.setText(`lvl: ${this.controller.getLevel()}`);
    this.controller.updateLevelText();
    this.controller.updateCharactiristicText()
    updateLootMagnet(this.player, this.itemManager);
    
    
   
  }



  private updateChunks() {
    const chunkX = Math.floor(this.player.x / (TILE_SIZE * CHUNK_SIZE));
    const chunkY = Math.floor(this.player.y / (TILE_SIZE * CHUNK_SIZE));

    // Загрузка новых чанков и спавн врагов в них
    for (let y = -VIEW_DISTANCE; y <= VIEW_DISTANCE; y++) {
      for (let x = -VIEW_DISTANCE; x <= VIEW_DISTANCE; x++) {
        const key = `${chunkX + x}:${chunkY + y}`;
        if (!this.loadedChunks.has(key)) {
          const layer = generateChunk(this, chunkX + x, chunkY + y, this.itemManager,this.colliderObjectManager);
          if (layer) {
            this.loadedChunks.set(key, layer);

            // Коллизия игрока со слоем
            this.physics.add.collider(this.player, layer,);

            // Спавн врагов в новом чанке
            this.spawnEnemiesInChunk(chunkX + x, chunkY + y);
          }
        }
      }
    }

    // Управление активацией врагов в зависимости от чанков в зоне видимости
    for (const [chunkKey, enemies] of this.enemiesByChunk.entries()) {
      const [cX, cY] = chunkKey.split(':').map(Number);
      if (Math.abs(cX - chunkX) > VIEW_DISTANCE || Math.abs(cY - chunkY) > VIEW_DISTANCE) {
        // Вне зоны видимости — деактивируем врагов
        enemies.forEach(enemy => {
          enemy.setActive(false);
          enemy.setVisible(false);
          if(enemy.body) {
            enemy.body.enable = false
          }
        });
      } else {
        // В зоне видимости — активируем врагов
        enemies.forEach(enemy => {
          enemy.setActive(true);
          enemy.setVisible(true);
          if (enemy.body) {
            enemy.body.enable = true;
          }
        });
      }
      
    }
    

    // Обновляем коллайдеры между игроком и активными врагами
    // this.enemies.forEach(enemy => {
    //   if (enemy.active) {
    //     this.physics.add.overlap(this.player, enemy, this.handleHit , undefined, this);  // Спросить что за параметры overlap
    //     this.physics.add.collider(this.player, enemy);
       



    //   }
    
    this.drawChunkBorders(chunkX, chunkY);
  }
  
}
