import Phaser from 'phaser';  // Если Phaser импортируется

export class TextManager {
    private scene: Phaser.Scene;
    private textObjects: Phaser.GameObjects.Text[] = [];  // Типизация массива

    constructor(scene: Phaser.Scene) {  // Указание типа для scene
        if (!scene || !scene.add || !scene.add.text) {
            throw new Error("Переданный объект не является сценой Phaser.");
        }
        this.scene = scene;
    }

    // Метод для создания текста
    createText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle) {
        const textObject = this.scene.add.text(x, y, text, style);
        this.textObjects.push(textObject);
        return textObject;
    }

    // Метод для обновления текста
    updateText(index: number, newText: string) {
        const textObject = this.textObjects[index];
        if (textObject) {
            textObject.setText(newText);
        }
    }

    // Метод для удаления текста
    removeText(index: number) {
        const textObject = this.textObjects[index];
        if (textObject) {
            textObject.destroy();
            this.textObjects.splice(index, 1);
        }
    }
}
