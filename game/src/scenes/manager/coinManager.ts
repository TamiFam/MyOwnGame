import { CoinUI } from "../../Coin/coinUI"


export class  CoinManager{
    private coinUI!: CoinUI
    private scene: Phaser.Scene
    private currentCoins: number = 0;
    constructor(
        scene: Phaser.Scene
    ){
this.scene = scene
this.coinUI = new CoinUI(scene);
    }
    public initUI() {
        this.coinUI.updateCoin(this.currentCoins);
      }

public addCoin(amount:number) {
    this.currentCoins = amount;
    this.coinUI.updateCoin(this.currentCoins);

   
}
// public setCoinAmount(amount: number) {
//     this.currentCoins = amount;
//     this.coinUI.updateCoin(this.currentCoins);
//   }

  public getCoinAmount(): number {
    return this.currentCoins;
  }



}