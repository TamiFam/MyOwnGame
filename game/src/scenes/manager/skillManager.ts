import { PlayerController } from '../Player/PlayerController';
import { SkillSelectionUI } from '../Skills/SkillSelectionUI';
import { Skill } from '../Skills/skill';
import type { skillData } from '../Skills/skillsData';
import { SkillGenerator } from '../generator/SkillGenerator';
import { eventBus } from '../../event/EventBus';
import { HeroSkillUI } from '../Skills/HeroSkillsUI';

export class SkillManager {
  private skills = new Map<string, Skill>();
  private skillPoints = 0;
  private scene: Phaser.Scene
  private skillSelectionUI?: SkillSelectionUI;
  private HeroSkillUI?: HeroSkillUI
  private playerController: PlayerController
  private cooldowns = new Map<string, boolean>();
  private skillCooldown!: Phaser.Sound.BaseSound
  private healSkillSound!: Phaser.Sound.BaseSound
  private cooldownText!: Phaser.GameObjects.Text
  

  constructor(scene: Phaser.Scene, playerController: PlayerController, initialSkills: Skill[] = []) {
    this.scene = scene;
    this.playerController = playerController
    initialSkills.forEach(skill => this.skills.set(skill.id, skill));
    this.skillCooldown = this.scene.sound.add('skillCooldown')
    this.healSkillSound = this.scene.sound.add('healSkillSound')
    document.fonts.load('13px "Press Start 2P"').then(() => {
      this.createCooldownText()
      
  });
  }
  private createCooldownText() {
    this.cooldownText = this.scene.add.text(
      960, 465,
      'Cooldown',
      {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '15px',
        color: '#9b59b6',
        stroke: '#2c3e50',
        strokeThickness: 1,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 1,
          fill: true,
        },
        padding: { x: 8, y: 4 },
        align: 'center',
      }
    ).setOrigin(0.5).setDepth(100).setVisible(true);
  }
 
public toggleSkillSelectionUI(): void {
  const allSkills = this.getAllSkills();

  // Функция выбора навыка
  const onSkillSelected = (skillId: string) => {
    this.levelUpSkill(skillId);
    

    // Обновляем UI с актуальными навыками
    const updatedSkills = this.getAllSkills();
    this.skillSelectionUI?.updateSkills(updatedSkills);

  
  };

  if (!this.skillSelectionUI) {
    this.skillSelectionUI = new SkillSelectionUI(this.scene, allSkills, onSkillSelected);
  } else {
    if (this.skillSelectionUI.container.visible) {
      this.skillSelectionUI.hide();
    } else {
      this.skillSelectionUI.show();
      
    }
  }
}

public toggleHeroSkillUI():void {
  const allSkills = this.getAllSkills();

  // Функция выбора навыка
  const onSkillSelected = (skillId: string) => {
    this.useSkill(skillId)
   
    const updatedSkills = this.getAllSkills();
    this.skillSelectionUI?.updateSkills(updatedSkills);

  
  };
  if(!this.HeroSkillUI) {
    this.HeroSkillUI = new HeroSkillUI(this.scene, allSkills, onSkillSelected)
  }
}
private useSkill(skillId: string){
  const skill = this.skills.get(skillId)
  if(!skill) return
  
  if(this.isOnCooldown(skillId)) {
    this.skillCooldown.play()
    this.showCooldownNotification(`Скилл ${skillId} ещё на кулдауне!`);
    
    return;
  }

  switch(skillId){
    case 'heal':
      this.playerController.playerHealth()
      this.healSkillSound.play({volume:0.5})
      skill.effect(this.playerController.sprite,skill.currentLevel,this.scene)
      
      

      break;
      case 'dash':
        this.playerController.dash()
        break;

  }
  const cooldown = skill.cooldown
  this.setCooldown(skillId, cooldown)
  this.HeroSkillUI?.startCooldown(skillId, cooldown)
   
}
public initializeSkills(initialSkillIds: string[]) {
  const generator = new SkillGenerator();
  for (const id of initialSkillIds) {
    const skill = generator.generateSkillById(id);
    if (skill) {
      this.addSkill(skill);
    }
  }
}
  addSkill(skill: Skill) {
    if (!this.skills.has(skill.id)) {
      this.skills.set(skill.id, skill);
    }
  }

  getSkill(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  grantSkillPoint() {
    this.skillPoints++;
    console.log(`Получено очко навыка! Всего очков: ${this.skillPoints}`);
  }

  getSkillPoints(): number {
    return this.skillPoints;
  }

  levelUpSkill(id: string): boolean {
    const skill = this.skills.get(id);
    if (skill && this.skillPoints > 0 && !skill.isMaxed()) {
      skill.levelUp();
      if(skill.id === 'dash') {
        eventBus.emit('upgrade-dash')
      }
      if(skill.id === 'heal'){
        
        eventBus.emit('upgrade-heal')
      }
      this.skillPoints--;
      console.log(`Навык "${skill.name}" повышен до уровня ${skill.currentLevel}`);
      return true;
    }
    return false;
  }
  private setCooldown(skillId: string, duration: number) {
    this.cooldowns.set(skillId, true);
  
    // Сброс через заданное время
    this.scene.time.delayedCall(duration, () => {
      this.cooldowns.set(skillId, false);
    });
  }
  private isOnCooldown(skillId: string): boolean {
    
    return this.cooldowns.get(skillId) === true;
    
  }

  private showCooldownNotification(message: string, duration: number = 1500) {
    if (!this.cooldownText) return;

    const playerPos = this.playerController.getPosition()
  
    this.cooldownText.setText(message);
    this.cooldownText.setPosition(playerPos.x,playerPos.y-50)
    this.cooldownText.setVisible(true);
  
    this.scene.time.delayedCall(duration, () => {
      this.cooldownText?.setVisible(false);
    });
  }
  updateSkills(newSkills: Skill[]) {
    // Очистим старые навыки и добавим новые
    this.skills.clear();
    newSkills.forEach(skill => this.skills.set(skill.id, skill));
    console.log('Навыки обновлены');
  }
}
