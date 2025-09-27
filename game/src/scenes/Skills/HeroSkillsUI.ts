import type { Skill } from "./skill";

export class HeroSkillUI {
  public container: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  private onSkillSelected: (skillId: string) => void;
  private iconMap: Map<string, Phaser.GameObjects.Image> = new Map()
  private cooldownMap: Map<string, Phaser.GameObjects.Rectangle> = new Map();
  private skillNumber: Skill[] = [];

  constructor(
    scene: Phaser.Scene,
    skills: Skill[],
    onSkillSelected: (skillId: string) => void
  ) {
    this.scene = scene;
    this.onSkillSelected = onSkillSelected;
    this.skillNumber = skills;

    // Создание контейнера с навыками
    this.container = scene.add.container(470, 860).setDepth(1000); // Поверх всего
    this.buildUI(skills);
    scene.add.existing(this.container);
    this.scene.input.keyboard?.on('keydown', this.handleKeyPress, this);
  }

  private buildUI(skills: Skill[]) {
    
    const padding = 50;
    const buttonWidth = 50;
    const buttonHeight = 50;

    // Очистить контейнер перед построением UI
    this.container.removeAll(true);

    skills.forEach((skill, index) => {
      const x = index * (buttonWidth + padding);
      const y = 0

      // Стилизуем кнопку с закругленными углами и тенями
      const btn = this.scene.add.rectangle(x, y, buttonWidth, buttonHeight, 0x232222)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setStrokeStyle(3, 0x444444) // Тонкая рамка
        
        .setDepth(1000) // Поверх всего
        .setInteractive({ useHandCursor: true });

     

      
      // Иконка слева от текста
      if (skill.iconKey) {
        const icon = this.scene.add.image(x + buttonWidth /2, y + buttonHeight / 2, skill.iconKey)
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDisplaySize(48, 48);

        

        this.container.add([btn, icon]);
        // 🔘 Добавим overlay для "перезарядки"
  const cooldownOverlay = this.scene.add.rectangle(
    icon.x ,
    icon.y ,
    48,
    48,
    0x000000,
    0.5 // прозрачность
  ).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(1010);

  
//   console.log('Создан overlay для скилла:', skill.id, cooldownOverlay.visible);
//   console.log(`Иконка ${skill.id} на координатах:`, icon.x, icon.y);
// console.log(`Overlay ${skill.id} на координатах:`, cooldownOverlay.x, cooldownOverlay.y);
// console.log('Контейнер видим?', this.container.visible);

  // 🧠 Сохраняем по id
  this.iconMap.set(skill.id, icon);
  this.cooldownMap.set(skill.id, cooldownOverlay);

    

        this.container.add([btn ,cooldownOverlay]);
      }

      // Обработчики событий для кнопки
      btn.on('pointerdown', () => {
        // (this.scene.input as any).enabledAttack = false;
        console.log('Нажали на скилл:', skill.id);

        this.onSkillSelected(skill.id);
        
        this.startCooldown(skill.id, 5000)
      });
    });
    
  }

  public updateSkills(skills: Skill[]) {
    this.buildUI(skills); // Обновляем UI с новыми скилами
   
    
  }
  public show() {
    this.container.setVisible(true); // Показываем UI
  }
  private handleKeyPress(event: KeyboardEvent) {
    const key = parseInt(event.key); // '1' -> 1, '2' -> 2 и т.д.
    if (isNaN(key) || key < 1 || key > this.skillNumber.length) return;
  
    const skill = this.skillNumber[key - 1];   
    if (skill) {
      this.onSkillSelected(skill.id);
      this.startCooldown(skill.id, 5000); // или передавай длительность динамически
    }
  }
  public startCooldown(skillId: string, duration: number) {
    const overlay = this.cooldownMap.get(skillId);
    if (!overlay) return;
    console.log(`Start cooldown overlay for skill ${skillId}`);
    overlay.setVisible(true);
  
    // ⏱️ Скрыть через duration миллисекунд
    this.scene.time.delayedCall(duration, () => {
        console.log(`Cooldown ended for skill ${skillId}`);
      overlay.setVisible(false);
    });
  }
 
}
