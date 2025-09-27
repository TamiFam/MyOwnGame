import Phaser from 'phaser';
import { HealthBar } from '../GeneralContent/healthBar';
import { Health } from '../GeneralContent/Health';
import { PlayerController } from '../Player/PlayerController'

import { smokeEffect } from '../../effects/smokeEffect';
import { LevelManager } from '../manager/levelManager';
import { generateLoot } from '../generator/lootGenerator';
import { ItemManager } from '../manager/ItemManager';
export class EnemyController {
  private speed = 200;
  private damage!: number
  private attackDistance!: number;
  private agroDistance = 450; // радиус "вида"
  private disengageDistance  = 450
  private isAttacking = false;
  private isAggro = false;
  private isDead = false;

  private hasPlayAgroSound = false

  private patrolPoints: Phaser.Math.Vector2[] = [];
  private currentPatrolIndex = 0;
  private waitTimer = 0;
  private waitDuration = 1000;
  private hitSound: Phaser.Sound.BaseSound
  // private health: Health;
  // private playerController: PlayerController
  private deathSound: Phaser.Sound.BaseSound;
  private agroSound: Phaser.Sound.BaseSound
  // private levelManager: LevelManager
  // private scene: Phaser.Scene
  // private itemManager: ItemManager
  

  constructor(
    private scene: Phaser.Scene,
    private enemy: Phaser.Physics.Arcade.Sprite,
    private player: Phaser.Physics.Arcade.Sprite,
    private health: Health,
    private healthBar: HealthBar,
    private playerController: PlayerController,
    private levelManager: LevelManager,
    private itemManager: ItemManager,
    private enemyType: 'warrior' | 'skeleton' | 'gorgona',
    private maxHealth: number = 100
  ) {
    this.hitSound = enemy.scene.sound.add('hitSound');
    this.agroSound = enemy.scene.sound.add('agroSound', {volume: 0.10});
    this.deathSound = enemy.scene.sound.add('enemyDeath',{ volume: 0.1});
    this.setEnemyParameters();
    this.generatePatrolPoints();
    this.health.onDeath(() => this.handleDeath());
  }
  
  public getEnemy(): Phaser.Physics.Arcade.Sprite {
    return this.enemy;
}
private setEnemyParameters() {
  switch(this.enemyType) {
    case 'skeleton': 
      this.damage = 50
      this.agroDistance = 350;
      this.attackDistance = 270;
      this.disengageDistance = 50; // например, чуть больше агро
      this.speed = 180; // если хочешь разную скорость
    break;
   
    case 'warrior': 
    this.damage = 25
    this.agroDistance = 350;
    this.attackDistance = 55;
    this.disengageDistance = 50;
    this.speed = 200;
  break;

   case 'gorgona':
    this.damage = 55
    this.agroDistance = 350;
    this.attackDistance = 55;
    this.disengageDistance = 50;
    this.speed = 200;
  break;
}
}

public takeDamage(amount: number) {
  this.health.takeDamage(amount);
  
  this.healthBar.updateHealthBar()
  
  
}
private handleDeath() {
  if (this.isDead) return;
  this.isDead = true;

  console.log('Враг погиб!');
  this.levelManager.levelUp();
  

  this.enemy.setVelocity(0);
  this.deathSound.play();

  switch (this.enemyType) {
    case 'warrior': 
    generateLoot(this.scene, this.enemy.x, this.enemy.y, this.itemManager, 1);
      
      this.healthBar.destroy();
      
      // Смерть воина — проигрываем анимацию и эффект дыма
      // this.enemy.play('warrior_death'); // проверь, что анимация есть

      
        
        
        

        smokeEffect(this.enemy.scene, this.enemy, this.playerController, () => {
          this.enemy.destroy();
        });
        
     
      break;

    case 'skeleton':
      generateLoot(this.scene, this.enemy.x, this.enemy.y, this.itemManager, 1);
      this.enemy.setImmovable(true);
      this.healthBar.destroy();
      // Смерть скелета
      this.enemy.play('skeleton_death');

      this.enemy.once('animationcomplete', () => {
        this.enemy.setAlpha(0);
        this.enemy.disableBody(true, false);
        this.enemy.destroy();
      });
      break;

    case 'gorgona':
      generateLoot(this.scene, this.enemy.x, this.enemy.y, this.itemManager, 2  );
      this.enemy.setImmovable(true);
      this.healthBar.destroy();
      // Смерть горгоны
      this.enemy.play('gorgona_dead');

      this.enemy.once('animationcomplete', () => {
        this.enemy.setAlpha(0);
        this.enemy.disableBody(true, false);
        this.enemy.destroy();
      });
      break;

    default:
      console.warn(`Неизвестный тип врага: ${this.enemyType}`);
      break;
  }
}

  private generatePatrolPoints() {
    const origin = new Phaser.Math.Vector2(this.enemy.x, this.enemy.y);
    for (let i = 0; i < 4; i++) {
      const offsetX = Phaser.Math.Between(-100, 100);
      const offsetY = Phaser.Math.Between(-100, 100);
      this.patrolPoints.push(new Phaser.Math.Vector2(origin.x + offsetX, origin.y + offsetY));
    }
  }

  update(time: number, delta: number) {
   
    if (this.isDead || this.isAttacking) return;

    const playerDistance = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);

    if (playerDistance < this.attackDistance) {
      this.enemy.setVelocity(0)
      this.startAttack();
      return;
    }

    if (playerDistance < this.agroDistance) {
    this.isAggro = true
      
      
      
    } else if (playerDistance >this.disengageDistance) {
      this.isAggro = false
    }
    

    if (this.isAggro) {
      if(this.enemyType === 'skeleton'){
        if(playerDistance > this.attackDistance) {
          this.chasePlayer()
        }
       
      } else {
        this.chasePlayer();
      }
      
      
      
    } else {
      this.patrol(delta);
    }
  }

  private patrol(delta: number) {
    if (this.isDead) return;
    const target = this.patrolPoints[this.currentPatrolIndex];
    const dir = new Phaser.Math.Vector2(target.x - this.enemy.x, target.y - this.enemy.y);
    const distance = dir.length();

    if (distance < 35) {
      this.enemy.setVelocity(0);
      this.waitTimer += delta;
      if (this.waitTimer >= this.waitDuration) {
        this.waitTimer = 0;
        this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
      }
      this.enemy.anims.pause();
      
      return;
    }

    dir.normalize();
    this.enemy.setVelocity(dir.x * this.speed, dir.y * this.speed);

    const anim = this.getWalkAnimation(dir);
    if (this.enemy.anims.getName() !== anim) {
      this.enemy.play(anim, true);
    }
  }

  private chasePlayer() {
    if (this.isDead) return;
    if(!this.hasPlayAgroSound ) {
      this.agroSound.play()
      this.hasPlayAgroSound = true
    }
    const dir = new Phaser.Math.Vector2(this.player.x - this.enemy.x, this.player.y - this.enemy.y);
    dir.normalize();
    this.enemy.setVelocity(dir.x * this.speed * 1.5, dir.y * this.speed * 1.5); // чуть быстрее

    const anim = this.getWalkAnimation(dir);
    if (this.enemy.anims.getName() !== anim) {
      this.enemy.play(anim, true);
     
      
    }
  }

  private getWalkAnimation(dir: Phaser.Math.Vector2): string {
    const enemyType = this.enemyType;
    const angle = Phaser.Math.RadToDeg(Math.atan2(dir.y, dir.x));
    let direction: string;
  
    if (angle >= -45 && angle <= 45) direction = 'right';
    else if (angle > 45 && angle < 135) direction = 'down';
    else if (angle >= 135 || angle <= -135) direction = 'left';
    else direction = 'up';
    if (enemyType === 'skeleton' || enemyType === 'gorgona' ) {
      return `${this.enemyType}_walk`; // например, если есть такая анимация
    }
  
    return `${this.enemyType}_walk_${direction}`;
  }
  
  
  private getAttackAnimation(dir: Phaser.Math.Vector2): string {
    const enemyType = this.enemyType;
    
    const angle = Phaser.Math.RadToDeg(Math.atan2(dir.y, dir.x));
    let direction: string;
  
    if (angle >= -45 && angle <= 45) direction = 'right';
    else if (angle > 45 && angle < 135) direction = 'down';
    else if (angle >= 135 || angle <= -135) direction = 'left';
    else direction = 'up';
  
    
    switch(enemyType) {

      case 'warrior':
        return `${enemyType}_attack_${direction}`
        
      case 'skeleton':
        return `${enemyType}_attack`
        

        case 'gorgona':
          return   `${enemyType}_attack${Phaser.Math.Between(1,3)}`
          

    }
  }

  private startAttack() {
    if(this.isDead) return
    this.isAttacking = true;
     // флаг для одного попадания
    this.hitSound.play({volume: 0.01})
    
    this.enemy.setVelocity(0);

    const dir = new Phaser.Math.Vector2(this.player.x - this.enemy.x, this.player.y - this.enemy.y).normalize();
    const attackAnim = this.getAttackAnimation(dir);
    this.enemy.play(attackAnim);

    

    this.enemy.once('animationcomplete', () => {

      if(this.enemyType === 'skeleton') {
       
        
      this.shootProjectile(dir)
      } else {
        this.meleeHit(dir)
      }
      this.isAttacking = false;
      
    });
  }
  private meleeHit(dir: Phaser.Math.Vector2) {
    const hitboxSize = 30;
    const offsetDistance = 30;
    const attackX = this.enemy.x + dir.x * offsetDistance;
    const attackY = this.enemy.y + dir.y * offsetDistance;

    const hitbox = this.enemy.scene.add.zone(attackX, attackY, hitboxSize, hitboxSize);
    this.enemy.scene.physics.world.enable(hitbox);
    const body = hitbox.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    let hasDealtDamage = false;
    this.enemy.scene.physics.add.overlap(hitbox, this.player, () => {
      
     
      
    if (hasDealtDamage || this.isDead) return;
    let damage = Math.floor((this.damage / this.playerController.armor))
         this.playerController.takeDamage(damage )
          hasDealtDamage = true
          // console.log('Игрок попал под удар врага!');
    });
  }
  private shootProjectile(dir: Phaser.Math.Vector2) {
    const projectile = this.enemy.scene.physics.add.sprite(this.enemy.x, this.enemy.y, 'skeleton_projectile');
    projectile.play('skeleton_projectile')
    // projectile.setScale(1.2)
    projectile.body.setSize(20,20)
    projectile.setVelocity(dir.x * 600, dir.y * 600); // скорость стрелы
    projectile.setDepth(5);
  
    
  
    this.enemy.scene.physics.add.overlap(projectile, this.player, () => {
      this.playerController.takeDamage(this.damage);
      projectile.destroy();
    });
  
    // Удаление через время, если не попала
    this.enemy.scene.time.delayedCall(2000, () => {
      if (projectile.active) projectile.destroy();
    });
  }
  
}
