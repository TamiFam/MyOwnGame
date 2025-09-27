export const TILE_SIZE = 32;
export const CHUNK_SIZE = 16;
export const VIEW_DISTANCE = 2;

export const GRASS_TILES = new Set<number>([
  ...Array(32).keys(), 62, 63
]);