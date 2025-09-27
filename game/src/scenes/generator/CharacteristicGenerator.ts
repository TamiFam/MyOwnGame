import { Characteristic } from "../Characterisctic/characteristic";
import { characteristicData } from "../Characterisctic/characteristicsData";


export class CharacteristicGenerator {

    private characteristicData = characteristicData
constructor(){}

generateCharacteristicById(id:string): Characteristic | null {
    const data = this.characteristicData.find(c => c.id === id)
    if (!data) return null;
    return new Characteristic(
        data.id,
        data?.name,
        data?.maxLevel,
        0,
        data?.iconKey
    )

}
generateCharacteristics(): Characteristic[]{
    return this.characteristicData.map(data =>
        new Characteristic(data.id, data.name, data.maxLevel, 0, data.iconKey)
        )
}




}