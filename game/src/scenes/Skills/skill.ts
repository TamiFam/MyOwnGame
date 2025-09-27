export class Skill {
    id: string;
    name: string;
    description: string;
    maxLevel: number;
    currentLevel: number;
    iconKey: string
    cooldown: number
    effect: (target: any, level: number,scene?: Phaser.Scene) => void
  
    constructor(
      id: string,
      name: string,
      description: string,
      maxLevel: number,
      currentLevel = 0,
      iconKey: string ,
      cooldown: number,
      effect: (target: any, level: number,scene?: Phaser.Scene) => void,
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.maxLevel = maxLevel;
      this.currentLevel = currentLevel;
      this.iconKey = iconKey
      this.cooldown = cooldown
      this.effect = effect;
    }
  
    levelUp(): boolean {
      if (this.currentLevel < this.maxLevel) {
        this.currentLevel++;
        return true;
      }
      return false;
    }
  
    isMaxed(): boolean {
      return this.currentLevel >= this.maxLevel;
    }
    applyEffect(target: any) {
        this.effect(target, this.currentLevel);
      }
  }
  