import { eventBus } from "../../event/EventBus";
import { CharacteristicSelectionUi } from "../Characterisctic/CharacteristicSelectionUi";
import type { Characteristic } from "../Characterisctic/characteristic";
import { CharacteristicGenerator } from "../generator/CharacteristicGenerator";


export class CharacteriscticManager {
    private characteristics = new Map<string, Characteristic>()
    private characteristicPoints = 0
    private scene: Phaser.Scene
    private characteristicSelectioinUi?: CharacteristicSelectionUi
    constructor(
       scene: Phaser.Scene, initialCharacteristic: Characteristic[] =[])

     {
this.scene = scene,
initialCharacteristic.forEach(charct => this.characteristics.set(charct.id, charct))
    }

    public togglecharacteristicSelectioinUi():void {
        const allCharacteristic = this.getAllCharacteristic()

     // Функция выбора характеристиками
    const onCharacterIscSelected = (charactId: string) => {
    const wasLevelUp = this.levelUpCharct(charactId);
    
if(wasLevelUp) {

// Обновляем UI с актуальными характеристиками
const updateCharct = this.getAllCharacteristic()
this.characteristicSelectioinUi?.updateCharcts(updateCharct)
}
  

    
  }
    if (!this.characteristicSelectioinUi) {
        this.characteristicSelectioinUi = new CharacteristicSelectionUi(this.scene, allCharacteristic, onCharacterIscSelected);
        this.characteristicSelectioinUi.show();
      } else {
        if (this.characteristicSelectioinUi.container.visible) {
          this.characteristicSelectioinUi.hide();
        } else {
          this.characteristicSelectioinUi.show();
          
        }
      }

    
}
public initializeCharct(initialSkillIds: string[]) {
    const generator = new CharacteristicGenerator();
    for (const id of initialSkillIds) {
      const skill = generator.generateCharacteristicById(id);
      if (skill) {
        this.addCharct(skill);
      }
    }
  }
  addCharct(charct: Characteristic) {
    if (!this.characteristics.has(charct.id)) {
      this.characteristics.set(charct.id, charct);
    }
  }

    getAllCharacteristic(): Characteristic[] {
        return Array.from(this.characteristics.values())
    }
    grantCharPoint() {
        this.characteristicPoints+=2;
        console.log(`Получено очко навыка! Всего очков: ${this.characteristicPoints}`);
      }
    levelUpCharct(id:string):boolean{
        const charct = this.characteristics.get(id)
        if(charct && this.characteristicPoints > 0 && !charct.isMaxed()) {
            charct.levelUp()
            if(charct.id === 'armor'){
              eventBus.emit('upgrade-armor')
            }
            this.characteristicPoints--
            console.log(`Характеристика "${charct.name}" повышен до уровня ${charct.currentLevel}`)
            return true
        }
        return false
    }
    
    updateCharacteristic(newCharacteristic: Characteristic[]){
        this.characteristics.clear()
        newCharacteristic.forEach(charct => this.characteristics.set(charct.id, charct))
        console.log('Характеристики обновлены');
    }
    
}