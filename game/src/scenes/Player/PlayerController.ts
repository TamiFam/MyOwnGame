import { Health } from '../GeneralContent/Health'
import { HealthBar } from '../GeneralContent/healthBar';
import { EnemyController } from '../Enemy/EnemyController';
import { LevelManager } from '../manager/levelManager';
import { TextManager } from '../manager/TextManager';


import { eventBus } from '../../event/EventBus'
import { levelUpEffect } from '../../effects/levelUpEffect';
import type { CoinManager } from '../manager/coinManager';


export class PlayerController {
  public readonly sprite: Phaser.Physics.Arcade.Sprite;
  public speed = 200;
  public armor = 1
  public slowSpeed = 70;
  public playerLevel = 1
  private isDashing = false;
  private dashSpeed = 800;
  private dashTime = 150; // мс
  private lastDirection = new Phaser.Math.Vector2(0, 0);
  private isAttacking = false
  private health: Health;
  private levelText?: Phaser.GameObjects.Text
  private CharacteristicText?: Phaser.GameObjects.Text
  private scene: Phaser.Scene
  private collectCoin= 0
  private coinManager?: CoinManager

  private levelupSound!: Phaser.Sound.BaseSound
 
  
  
  private healthBar: HealthBar;
  private attackCollider?: Phaser.Physics.Arcade.Collider;
  private enemyControllers: EnemyController[];
  private attackDamage: Record<number, number>  = {
    0: 20,
    2: 50,
  };
  public lastAttackButton?: number
  private heroDash: Phaser.Sound.BaseSound
  private missHit: Phaser.Sound.BaseSound
  private hitSound: Phaser.Sound.BaseSound
  private dashSoundVolume = 0.05
  private missHitSound = 0.06
  private hitSoundVolume = 0.05
  
  

  

  constructor(
    scene: Phaser.Scene,
    private player: Phaser.Physics.Arcade.Sprite,
    private keys: Record<'up' | 'left' | 'down' | 'right' | 'dash' | 'crouch', Phaser.Input.Keyboard.Key>,
    private enemies: Phaser.Physics.Arcade.Sprite[],
     enemyControllers: EnemyController[],
     coinManager?: CoinManager,
    
    maxHealth: number = 100,
    levelManager?: LevelManager,
   
    
    
    
    
    
    
    
  ) {
    this.scene = scene;
    this.health = new Health('player');
    this.healthBar = new HealthBar(player.scene, player, 55 ,6 ,-55, this.health);
    this.enemyControllers = enemyControllers
    this.heroDash =  player.scene.sound.add('heroDash',{volume: this.dashSoundVolume })
    this.missHit = player.scene.sound.add('missHit',{volume: this.missHitSound})
    this.hitSound = player.scene.sound.add('hitSound',{volume: this.hitSoundVolume})
   
    this.levelupSound = scene.sound.add('levelup')
    this.setupEventListeners()
    this.sprite = player;
    this.coinManager = coinManager
    
    
  }
  public takeDamage(amount: number) {
    this.health.takeDamage(amount);
    
    this.healthBar.updateHealthBar()
    

    console.log(`Враг получил урон ${amount}, текущее здоровье: ${this.health.getCurrentHealth()}`)

    if (!this.health.isAlive()) {
      this.handleDeath();
    }
  }
  private handleDeath() {
    // Здесь логика смерти игрока: проигрыш, перезагрузка сцены, анимация смерти и т.п.
    console.log('Игрок погиб!');
    
  }
  public getIsAttacking(): boolean {
    return this.isAttacking;
  }
  public increaseAttack() {
    for( const key in this.attackDamage) {
      if(this.attackDamage.hasOwnProperty(key)) {
        this.attackDamage[+key] +=2
      }
    }
    // console.log('Updated attackDamage:', this.attackDamage);
  
  }
  public increaseeCoin() {
       
          this.collectCoin +=1
          console.log(this.collectCoin)
       this.coinManager?.addCoin(this.collectCoin)
    }
    // console.log('Updated attackDamage:', this.attackDamage);
  
  
  public increaseCharacteristics(){
    for( const key in this.attackDamage) {
      if(this.attackDamage.hasOwnProperty(key)) {
        this.attackDamage[+key] +=10
      }
    } 
    this.health.increaseCurrentHealthLevel(this.playerLevel) 
    this.speed +=Math.floor((this.speed /180) * this.playerLevel)
  }
  levelHeroUi() {
    const baseScale = 1.1;  // тот масштаб, под который ты подбирал текст
    const playerScale = this.player.scale;
  
    this.levelText = this.scene.add.text(this.player.x, this.player.y, `Уровень: ${this.getLevel()}`, {
      fontSize: '10px',         // зафиксированный базовый размер
      color: '#ffffff',
      fontFamily: 'Arial'
    })
      .setOrigin(0.5, 1)         // по центру, над головой
      .setScrollFactor(1)
      .setDepth(1000)
      .setScale(playerScale / baseScale ); // масштабируем текст в соотношении с игроком
  }
  updateLevelText() {
    if (!this.levelText) return;
  
    const baseScale = 1.1;
    const playerScale = this.player.scale;
    const offsetY = 50 * (playerScale / baseScale); // выше головы, пропорционально
  
    this.levelText.setText(`Уровень: ${this.getLevel()}`);
    this.levelText.setPosition(this.player.x, this.player.y - offsetY);
    this.levelText.setScale(playerScale / baseScale);
  }
  getLevel() {
    return this.playerLevel;
  }
  HeroCharacteristicUi() {
    const style = {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'Changa One',  // Указываем название шрифта
    };
    this.CharacteristicText = this.scene.add.text(126, this.scene.cameras.main.height - 12, `Характеристики: }`)
    .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(1005)
      .setScale(1)
  
  }
  updateCharactiristicText() {
    if (this.CharacteristicText) {
      const newText = `Скорость: ${this.speed}\n` +
      `Урон(легкий): ${this.attackDamage[0]}\n` +
      `Урон(тяжелый): ${this.attackDamage[2]}\n` +
      `Здоровье: ${this.health.getCurrentHealth()}/${this.health.getHeroMaxHealth()}\n` +
      `Броня: ${this.armor}\n`

// Используем метод для изменения текста
this.CharacteristicText.setText(newText);

  
      this.CharacteristicText.setPosition(16, this.scene.cameras.main.height - 16);
      
    }
    // console.log('Speed:', this.speed);
    
  
  }
  public playerHealth() {
    this.health.increaseCurrentHealthSkill(40)
    this.healthBar.updateHealthBar()
  }
  
 

  public levelUp() {
    this.levelupSound.play({volume: 1.1})
    this.playerLevel +=1
    levelUpEffect(this.player.scene, this.player, () =>{
      // this.player.destroy();
      
    })
    this.health.increaseCurrentHealthLevel(this.playerLevel)
    console.log(this.health.getHeroMaxHealth())
    this.healthBar.updateHealthBar()
    
    console.log(`Сейчас уровень ${this.playerLevel}`)
  }
  attack(mouseButton: number) {
    if (this.isAttacking) return;
  
    this.isAttacking = true;
    this.player.setVelocity(0);
    if(mouseButton  === 0) {
      this.player.play('attack');
      this.lastAttackButton = 0
    } else  if(mouseButton === 2){
      this.player.play('attack2');
      this.lastAttackButton = 2
    }
    
  
    const hitbox = this.createAttackHitbox();
  
    let hasDealtDamage = false; // флаг для одного попадания
    
    
  
    this.enemies.forEach(enemy => {
      this.attackCollider = this.player.scene.physics.add.overlap(hitbox, enemy, () => {
        if (hasDealtDamage) return; // уже нанесли урон, игнорируем
  
        const controller = this.enemyControllers.find(ctrl => ctrl.getEnemy() === enemy);
        if (controller && this.lastAttackButton !== undefined) {
         const damage = this.getAttackDamage(this.lastAttackButton)
         controller.takeDamage(damage)
         hasDealtDamage = true
         this.hitSound.play()
         
        }
      })
    if(hasDealtDamage === false) {
      this.missHit.play()
    }
    });
  
    this.player.once('animationcomplete', () => {
      this.isAttacking = false;
      hitbox.destroy();
      if (this.attackCollider) {
        this.player.scene.physics.world.removeCollider(this.attackCollider);
        this.attackCollider = undefined;
      }
    });
  }

  private getAttackDamage(attackType: number): number {
    return this.attackDamage[attackType] ?? 0;
  }
 private  setupEventListeners() {
  eventBus.on('upgrade-dash', this.upgradeDashSkill, this)
  eventBus.on('upgrade-heal',this.upgradeHealthSkill,this)

  eventBus.on('upgrade-armor',this.upgradeArmorthCharct,this)

 }
 destroy() {
  eventBus.off('upgrade-dash', this.upgradeDashSkill,this)
  eventBus.off('upgrade-heal', this.upgradeHealthSkill,this)

  eventBus.on('upgrade-armor',this.upgradeArmorthCharct,this)
 }
 private upgradeDashSkill() {
  return this.dashSpeed +=1000
 }
 private upgradeHealthSkill() {
   return (
    this.health.upgradeHealthSkill(),
    this.healthBar.updateHealthBar()
   )
 }
 private upgradeArmorthCharct() {
  return this.armor +=1
 }
 public dash() {
  this.isDashing = true;
      

      const dashVelocity = this.lastDirection.clone().scale(this.dashSpeed);
      this.player.setVelocity(dashVelocity.x, dashVelocity.y);
      this.heroDash.play()

      this.player.scene.time.delayedCall(this.dashTime, () => {
        this.isDashing = false;
 })
      }
      
  
  private createAttackHitbox() {
    const dir = this.lastDirection.clone().normalize();
    const hitboxSize = 30;
    const offset = 30;
  
    const x = this.player.x + dir.x * offset;
    const y = this.player.y + dir.y * offset;
  
    const hitbox = this.player.scene.add.zone(x, y, hitboxSize, hitboxSize);
    this.player.scene.physics.world.enable(hitbox);
    const body = hitbox.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
  
    return hitbox;
  }
  getPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.player.x, this.player.y);
  }
  

  update() {
    let  speed = this.speed;
    const SLOW_SPEED = this.slowSpeed
    
    if (this.isAttacking) return;
    
    

    
    

    // Направление движения
    const dir = new Phaser.Math.Vector2(0, 0);
    if (this.keys.left.isDown) {
      dir.x = -1;
      this.player.setFlipX(true);
    } else if (this.keys.right.isDown) {
      dir.x = 1;
      this.player.setFlipX(false);
    }

    if (this.keys.up.isDown) {
      dir.y = -1;
    } else if (this.keys.down.isDown) {
      dir.y = 1;
    }

    // Обновляем направление
    if (dir.length() > 0) {
      this.lastDirection = dir.clone().normalize();
    }

    // Dashing по клавише Space
    if (Phaser.Input.Keyboard.JustDown(this.keys.dash) && !this.isDashing) {
      this.isDashing = true;
      

      const dashVelocity = this.lastDirection.clone().scale(this.dashSpeed);
      this.player.setVelocity(dashVelocity.x, dashVelocity.y);
      this.heroDash.play()

      this.player.scene.time.delayedCall(this.dashTime, () => {
        this.isDashing = false;
      });
    }
    
    // Шифтим 
    if (this.keys.crouch.isDown) {
      speed = SLOW_SPEED; // например 60
      this.player.play('crouch', true);
      
    } 

    // Если не дашим — обычное движение
    if (!this.isDashing) {
      this.player.setVelocity(dir.x * speed, dir.y * speed);
    }

    
    // Анимации
    
    const currentAnim = this.player.anims.currentAnim?.key;
    const moving = this.player.body!.velocity.length() > 0;

    
    if (this.keys.crouch.isDown) {
      if (this.player.anims.currentAnim?.key !== 'crouch') {
        this.player.play('crouch', true);
      }
      return; // прерываем дальше, чтобы не перекрыть crouch
    }
    if (!this.isAttacking) {
      if (moving && currentAnim !== 'run') {
        this.player.play('run', true);
      } else if (!moving && currentAnim !== 'idle') {
        this.player.play('idle', true);
      }
    }

    
   
    
    
    
  }
  
}
