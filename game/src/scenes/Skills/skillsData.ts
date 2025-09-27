import { healEffect } from '../../effects/healEffect';
const fireballEffect = (target: any, level: number) => {
  target?.takeDamage?.(level * 20);
};

export const healPlayerEffect = (
  target: any,
  level: number,
  scene?: Phaser.Scene
) => {
  if (!scene || !target) return;

  healEffect(scene, target, () => {
    console.log('Анимация лечения завершена');
  });
};

const dashEffect = (target: any, level: number) => {
  console.log(`Ускорение на ${level * 10}%`);
};

// Массив скиллов с эффектами
export const skillData = [
  { 
    id: 'fireball', 
    name: 'Огненный шар', 
    description: 'Наносит урон огнём врагу.', 
    maxLevel: 5, 
    iconKey: 'fireball',
    cooldown:5000,
    effect: fireballEffect,
  },
  { 
    id: 'heal', 
    name: 'Лечение', 
    description: 'Восстанавливает здоровье.', 
    maxLevel: 3, 
    iconKey: 'heal',
    cooldown:0,
    effect: healPlayerEffect,
  },
  { 
    id: 'dash', 
    name: 'Рывок', 
    description: 'Ускорение.', 
    maxLevel: 3, 
    iconKey: 'dash',
    cooldown:5000,
    effect: dashEffect,
  },
];
