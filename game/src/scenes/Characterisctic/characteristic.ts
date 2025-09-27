

export class Characteristic {
   id: string;
   name: string;
   maxLevel: number;
   currentLevel: number;
   
   iconKey: string;

constructor(
id:string,
name:string,
maxLevel: number,
currentLevel: number,
iconKey: string,


){
this.id = id,
this.name = name,
this.maxLevel = maxLevel,
this.currentLevel = currentLevel,
this.iconKey = iconKey

}
isMaxed():boolean {
   return this.currentLevel >= this.maxLevel
}
levelUp():boolean {
   if(this.currentLevel < this.maxLevel){
      this.currentLevel ++
      return true
   }
   return false
}

}