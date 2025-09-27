import type { PlayerController } from "../Player/PlayerController";
import type { CharacteriscticManager } from "./characteristicManager";
import type { SkillManager } from "./skillManager";


export  class LevelManager {
  
    private level = 1
    private exp = 0
    private expForKill = 50
    private expForLevelUp = 100
constructor( private player: PlayerController, private skillManager: SkillManager, private characteristicManager: CharacteriscticManager){
    
}


levelUp() {
    this.exp += this.expForKill;
    console.log('Опыт +50');
    console.log(`Текущий опыт: ${this.exp}`);

    if (this.exp >= this.expForLevelUp) {
      this.player.levelUp();
      this.skillManager.grantSkillPoint();
      this.characteristicManager.grantCharPoint()
      this.exp = 0;
      this.expForLevelUp += 50;
      this.player.increaseCharacteristics();
    
  }

    
    


}





}