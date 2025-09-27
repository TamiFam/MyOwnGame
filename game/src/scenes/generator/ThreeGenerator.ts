import { CHUNK_SIZE, GRASS_TILES } from '../../constants/World';

const treeWidth = 3;
const treeHeight = 5;
const treeTiles = [
  [1, 2, 3],
  [17, 18, 19],
  [33, 34, 35],
  [49, 50, 51],
  [-1, 66, -1]
];

function canPlaceTreeAt(layer: Phaser.Tilemaps.TilemapLayer, x: number, y: number): boolean {
  if (x + treeWidth > CHUNK_SIZE || y + treeHeight > CHUNK_SIZE) return false;

  for (let ty = 0; ty < treeHeight; ty++) {
    for (let tx = 0; tx < treeWidth; tx++) {
      const tile = layer.getTileAt(x + tx, y + ty);
      if (!tile || !GRASS_TILES.has(tile.index)) return false;
    }
  }
  return true;
}

export function tryPlaceTree(
  layer: Phaser.Tilemaps.TilemapLayer,
  plantLayer: Phaser.Tilemaps.TilemapLayer
): void {
  const chance = 0.09;
  if (Math.random() > chance) return;

  const maxAttempts = 30;
  for (let i = 0; i < maxAttempts; i++) {
    const x = Phaser.Math.Between(0, CHUNK_SIZE - treeWidth);
    const y = Phaser.Math.Between(0, CHUNK_SIZE - treeHeight);

    if (canPlaceTreeAt(layer, x, y)) {
      for (let ty = 0; ty < treeHeight; ty++) {
        for (let tx = 0; tx < treeWidth; tx++) {
          const index = treeTiles[ty][tx];
          if (index !== -1) {
            plantLayer.putTileAt(index, x + tx, y + ty);
          }
        }
      }
      plantLayer.setDepth(1);
      break;
    }
  }
}
