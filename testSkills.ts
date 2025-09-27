// import { Skill } from './game/src/scenes/Skills/skill';
// import { SkillManager } from './game/src/scenes/manager/skillManager';

// // Создаем несколько скиллов
// const fireball = new Skill(
//     'fireball',
//     'Огненный шар',
//     'Наносит урон огнём врагу.',
//     5,
//     0,(target, level) => {
//         target.takeDamage?.(level * 20);
//       }
//   )

//   const dash = new Skill(
//     'dash',
//     'рывок',
//     'меняет позицию.',
//     5,
//     0,
//     (target, level) => {
//         console.log(`Рывок увеличивает скорость на ${level * 10}%`);
//       }
//   );

// // Создаем менеджер и добавляем скиллы
// const skillManager = new SkillManager();
// skillManager.addSkill(fireball);
// skillManager.addSkill(dash);

// // Выдаем 2 очка навыков
// skillManager.grantSkillPoint();
// skillManager.grantSkillPoint();

// console.log('Текущее количество очков:', skillManager.getSkillPoints());

// // Повышаем уровень скилла "Огненный шар"
// const leveledUp = skillManager.levelUpSkill('fireball');
// if (leveledUp) {
//   console.log(`Навык огненный шар теперь уровня ${skillManager.getSkill('fireball')?.currentLevel}`);
// }

// // Повышаем уровень скилла "Рывок"
// skillManager.levelUpSkill('dash');
// console.log(`Навык рывок теперь уровня ${skillManager.getSkill('dash')?.currentLevel}`);

// // Проверяем сколько осталось очков
// console.log('Оставшиеся очки навыков:', skillManager.getSkillPoints());

// // Можно также вызвать эффект скилла на примере цели
// const dummyTarget = {
//   takeDamage(amount: number) {
//     console.log(`Цель получила урон: ${amount}`);
//   }
// };

// skillManager.getSkill('fireball')?.applyEffect(dummyTarget);
