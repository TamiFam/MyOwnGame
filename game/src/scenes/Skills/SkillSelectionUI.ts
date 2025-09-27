import type { Skill } from "./skill";

export class SkillSelectionUI {
  public container: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  private onSkillSelected: (skillId: string) => void;

  constructor(
    scene: Phaser.Scene,
    skills: Skill[],
    onSkillSelected: (skillId: string) => void
  ) {
    this.scene = scene;
    this.onSkillSelected = onSkillSelected;

    // Создание контейнера с навыками
    this.container = scene.add.container(1370, 730).setDepth(1000); // Поверх всего
    this.buildUI(skills);
    scene.add.existing(this.container);
  }

  private buildUI(skills: Skill[]) {
    const padding = 10;
    const buttonWidth = 500;
    const buttonHeight = 80;

    // Очистить контейнер перед построением UI
    this.container.removeAll(true);

    skills.forEach((skill, index) => {
      const y = index * (buttonHeight + padding);

      // Стилизуем кнопку с закругленными углами и тенями
      const btn = this.scene.add.rectangle(0, y, buttonWidth, buttonHeight, 0x232222)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setStrokeStyle(3, 0x444444) // Тонкая рамка
        
        .setDepth(1000) // Поверх всего
        .setInteractive({ useHandCursor: true });

      // Плавные переходы для эффектов при наведении
      btn.setAlpha(0.8);
      btn.on('pointerover', () => {
        btn.setAlpha(1); // При наведении увеличиваем яркость
        (this.scene.input as any).enabledAttack = false;
      });

      btn.on('pointerout', () => {
        btn.setAlpha(0.8); // При убирании указателя возвращаем нормальную яркость
        (this.scene.input as any).enabledAttack = true;
      });

      // Иконка слева от текста
      if (skill.iconKey) {
        const icon = this.scene.add.image(20, y + buttonHeight / 2, skill.iconKey)
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDisplaySize(48, 48);

        // Размещение текста справа от иконки, выравнивание по вертикали
        const text = this.scene.add.text(80, y + buttonHeight / 2, `${skill.name} (lvl: ${skill.currentLevel})`, {
          fontSize: '32px',
          color: '#ffffff',
          fontStyle: 'bold',
        }).setOrigin(0, 0.5) // Вертикальное выравнивание текста
          .setScrollFactor(0);

        this.container.add([btn, icon, text]);
      } else {
        console.warn(`Icon for skill ${skill.name} is missing!`);
        // В случае отсутствия иконки, добавляем только кнопку с текстом
        const text = this.scene.add.text(20, y + buttonHeight / 2, `${skill.name} (lvl: ${skill.currentLevel})`, {
          fontSize: '32px',
          color: '#ffffff',
          fontStyle: 'bold',
        }).setOrigin(0, 0.5).setScrollFactor(0);

        this.container.add([btn, text]);
      }

      // Обработчики событий для кнопки
      btn.on('pointerdown', () => {
        console.log('Нажали на скилл:', skill.id);
        this.onSkillSelected(skill.id);
      });
    });
  }

  public updateSkills(skills: Skill[]) {
    this.buildUI(skills); // Обновляем UI с новыми скилами
  }

  public hide() {
    this.container.setVisible(false); // Скрываем UI
    (this.scene.input as any).enabledAttack = true;
  }

  public show() {
    this.container.setVisible(true); // Показываем UI
    (this.scene.input as any).enabledAttack = false;
  }
}
