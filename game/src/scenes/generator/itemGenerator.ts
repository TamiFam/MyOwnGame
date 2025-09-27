import { Scene } from "phaser"
import { CHUNK_SIZE, TILE_SIZE } from "../../constants/World"
import type { ItemManager } from "../manager/ItemManager"

export function itemGenerator(
    scene: Phaser.Scene,
    chunkX: number,
    chunkY: number,
    worldX: number,
    worldY: number,
    itemManager: ItemManager
): void {
    const itemChances = [
        { texture: 'sword', chance: 0.21 },
        { texture: 'sword11', chance: 0.01 },
        // { texture: 'chest1', chance: 0.04 }
    ];

    function spawnItem(texture: string) {
        const x = Phaser.Math.Between(worldX, worldX + CHUNK_SIZE * TILE_SIZE);
        const y = Phaser.Math.Between(worldY, worldY + CHUNK_SIZE * TILE_SIZE);
        const item = scene.physics.add.sprite(x, y, texture);
        item.setDepth(1);

        

        const body = item.body as Phaser.Physics.Arcade.Body | null;
        if (body) {
            body.setAllowGravity(false);
        }
        scene.tweens.add({
            targets: item,
            y: y - 10,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        itemManager.addExistingItem1(item);
    }

    for (const item of itemChances) {
        if (Math.random() < item.chance) {
            spawnItem(item.texture);
        }
    }
}
