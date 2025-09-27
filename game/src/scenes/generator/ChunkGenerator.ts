import { GRASS_TILES, TILE_SIZE, CHUNK_SIZE } from '../../constants/World';
import { noise2D } from '../utils/noise';
import { ItemManager } from '../manager/ItemManager';
import { itemGenerator } from './itemGenerator';
import { colliderObjectGenerator } from './colliderObjectGenerator';
import type { ColliderObjectManager } from '../manager/ColliderObjectManager';
export const navigationGrids: Map<string, number[][]> = new Map();
export function generateChunk(
  
  scene: Phaser.Scene,
  chunkX: number,
  chunkY: number,
  // player: Phaser.GameObjects.GameObject,
  itemManager: ItemManager,
  colliderObjectManager: ColliderObjectManager
): 
Phaser.Tilemaps.TilemapLayer | null {
  const map = scene.make.tilemap({
    tileWidth: TILE_SIZE,
    tileHeight: TILE_SIZE,
    width: CHUNK_SIZE,
    height: CHUNK_SIZE,
  });
  const collisionTiles: number[] = [];
  const tileset = map.addTilesetImage('TX Tileset Grass', 'TX Tileset Grass', TILE_SIZE, TILE_SIZE, 0, 0);
  const plantTileset = map.addTilesetImage('TX Tileset Plants', 'TX Tileset Plants', TILE_SIZE, TILE_SIZE, 0, 0);
  if (!tileset || !plantTileset) return null;

  

  

  const grassLayer = map.createBlankLayer('chunk', tileset, 0, 0);
  const plantLayer = map.createBlankLayer('plant', plantTileset, 0, 0);
  if (!grassLayer || !plantLayer) return null;

    // Новая сетка проходимости
    const walkabilityGrid: number[][] = [];

    for (let y = 0; y < CHUNK_SIZE; y++) {
      walkabilityGrid[y] = [];
  
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const worldX = chunkX * CHUNK_SIZE + x;
        const worldY = chunkY * CHUNK_SIZE + y;
        

      const noiseValue = noise2D(worldX / 30, worldY / 30);
      const normalized = (noiseValue + 1) / 2;

      let tileIndex: number;
      let tile: Phaser.Tilemaps.Tile | undefined;

      if (normalized < 0.12) {
        grassLayer.putTileAt(1, x, y);
        const bushVariants = [97, 99, 101];
        const randomIndex = Phaser.Math.Between(0, bushVariants.length - 1);
        tileIndex = bushVariants[randomIndex];
        tile = plantLayer.putTileAt(tileIndex, x, y);
      } else if (normalized < 0.85) {
        const grassVariants = [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        const variantIndex = Math.floor(normalized * grassVariants.length);
        tileIndex = grassVariants[variantIndex];
        tile = grassLayer.putTileAt(tileIndex, x, y);
      } else {
        const rockVariants = [32, 33, 41, 49, 48];
        const randomIndex = Phaser.Math.Between(0, rockVariants.length - 1);
        tileIndex = rockVariants[randomIndex];
        tile = grassLayer.putTileAt(tileIndex, x, y);
      }

      if (!GRASS_TILES.has(tileIndex)) {
        if (!collisionTiles.includes(tileIndex)) {
          collisionTiles.push(tileIndex);
        }
      }
      walkabilityGrid[y][x] = GRASS_TILES.has(tileIndex) ? 0 : 1;
    }
  }

  // --- Дерево ---
  const treeTiles = [
    [1, 2, 3],
    [17, 18, 19],
    [33, 34, 35],
    [49, 50, 51],
    [-1, 66, -1],
  ];

  const treeWidth = 3;
  const treeHeight = 5;

  const canPlaceTreeAt = (x: number, y: number): boolean => {
    if (x + treeWidth > CHUNK_SIZE || y + treeHeight > CHUNK_SIZE) return false;
    for (let ty = 0; ty < treeHeight; ty++) {
      for (let tx = 0; tx < treeWidth; tx++) {
        const tile = grassLayer.getTileAt(x + tx, y + ty);
        if (!tile || !GRASS_TILES.has(tile.index)) return false;
      }
    }
    return true;
  };

  const treeChance = 0.09;
  if (Math.random() < treeChance) {
    let placed = false;
    for (let attempt = 0; attempt < 30 && !placed; attempt++) {
      const x = Phaser.Math.Between(0, CHUNK_SIZE - treeWidth);
      const y = Phaser.Math.Between(0, CHUNK_SIZE - treeHeight);
      if (canPlaceTreeAt(x, y)) {
        for (let ty = 0; ty < treeHeight; ty++) {
          for (let tx = 0; tx < treeWidth; tx++) {
            const treeTile = treeTiles[ty][tx];
            if (treeTile !== -1) {
              plantLayer.putTileAt(treeTile, x + tx, y + ty);
              // Обновим сетку: деревья — препятствия
              walkabilityGrid[y + ty][x + tx] = 1;
            }
          }
        }
        plantLayer.setDepth(2);
        placed = true;
      }
    }
  }
  // Позиционирование
  const px = chunkX * CHUNK_SIZE * TILE_SIZE;
  const py = chunkY * CHUNK_SIZE * TILE_SIZE;
  grassLayer.setPosition(px, py);
  plantLayer.setPosition(px, py);
  
  grassLayer.setCollision(collisionTiles, true);

  const key = `${chunkX}:${chunkY}`
  navigationGrids.set(key, walkabilityGrid);

  itemGenerator(scene, chunkX,chunkY ,px,py, itemManager)
  colliderObjectGenerator(scene, chunkX,chunkY, px,py, colliderObjectManager )
  return grassLayer;
}
