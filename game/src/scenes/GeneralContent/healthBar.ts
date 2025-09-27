import type { Health } from "./Health";

export class HealthBar {
  private bar: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.Text;
 

  constructor(
    private scene: Phaser.Scene,
    private entity: Phaser.Physics.Arcade.Sprite,
    private width: number = 50,
    private height: number = 5,
    private offsetY: number = -30,
    private health: Health
) {
    this.bar = scene.add.graphics().setDepth(1000);
    this.text = scene.add.text(0, 0, '', {
      fontSize: '11px',
      color: '#000000',
      align: 'center',
      fontStyle: 'bold', 
      // fontFamily: '"Press Start 2P", monospace',
      
    }).setOrigin(0.5).setDepth(1001); // поверх бара
    this.updateHealthBar();
    scene.events.on('update', this.updatePosition, this);
    // this.text.setShadow(1, 1, '#000000', 1, false, true);
}

  private updatePosition(): void {
    if (!this.entity.active) return;

    const x = this.entity.x - this.width / 2;
    const y = this.entity.y + this.offsetY;
    this.bar.setPosition(x,y)
    this.text.setPosition(x + this.width / 2, y + this.height / 2);
  }

  public updateHealthBar(): void {
   

    const current = this.health.getCurrentHealth();
    const max = this.health.getHeroMaxHealth();

    if(current <= 0){
      this.bar.setVisible(false)
      this.text.setVisible(false)
      return
    }
    this.bar.setVisible(true);
    this.text.setVisible(true);
    this.bar.clear();
 
    const percent = current / max;
    const barWidth = percent * this.width;
    const color = percent < 0.3 ? 0xff0000 : 0x00ff00;

    this.bar.fillStyle(0x808080, 0.8);
    this.bar.fillRect(0, 0, this.width, this.height);

    this.bar.fillStyle(color, 1);
    this.bar.fillRect(0, 0, barWidth, this.height);

    this.bar.lineStyle(1, 0xffffff, 1);
    this.bar.strokeRect(0, 0, this.width, this.height);

    this.text.setText(`${current}/ ${max}`)
      
  }

  public destroy(): void {
    this.scene.events.off("update", this.updatePosition, this);
    this.bar.destroy();
    this.text.destroy(); 
    
  }
}
