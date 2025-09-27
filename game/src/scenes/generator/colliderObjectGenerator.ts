import { Scene } from "phaser";
import { CHUNK_SIZE, TILE_SIZE } from "../../constants/World";
import type { ColliderObjectManager } from "../manager/ColliderObjectManager";

export function colliderObjectGenerator(
    scene: Phaser.Scene,
    chunkX: number,
    chunkY: number,
    worldX: number,
    worldY: number,
    colliderObjectManager: ColliderObjectManager,
    objectChances: { texture: string; chance: number }[] =[
        { texture: 'chest1', chance: 0.24 }
    ]
): Phaser.Physics.Arcade.Sprite[] {
    const objects: Phaser.Physics.Arcade.Sprite[] = [];

    function spawnObject(texture: string) {
        const x = Phaser.Math.Between(worldX, worldX + CHUNK_SIZE * TILE_SIZE);
        const y = Phaser.Math.Between(worldY, worldY + CHUNK_SIZE * TILE_SIZE);
        const obj = scene.physics.add.sprite(x, y, texture);
        obj.setDepth(1);
        obj.setScale(0.02)
        obj.body.setSize(30,30)
        

        const body = obj.body as Phaser.Physics.Arcade.Body | null;
        if (body) {
            body.setAllowGravity(false);
            body.setImmovable(true);
        }

        
        obj.setData('type', 'chest')
        obj.setData('opened', false)
        colliderObjectManager.addObject(obj);
        scene.tweens.add({
            targets: obj,
            angle: { from: -1, to: 2 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        objects.push(obj);
    }

    for (const obj of objectChances) {
        if (Math.random() < obj.chance) {
            spawnObject(obj.texture);
        }
    }

    return objects;

   
}

