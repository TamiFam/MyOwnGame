"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var skill_1 = require("./game/src/scenes/Skills/skill");
var skillManager_1 = require("./game/src/scenes/manager/skillManager");
// Создаем несколько скиллов
var fireball = new skill_1.Skill('fireball', 'Огненный шар', 'Наносит урон огнём врагу.', 5, 0, function (target, level) {
    var _a;
    (_a = target.takeDamage) === null || _a === void 0 ? void 0 : _a.call(target, level * 20);
});
var dash = new skill_1.Skill('dash', 'рывок', 'меняет позицию.', 5, 0, function (target, level) {
    console.log("\u0420\u044B\u0432\u043E\u043A \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043D\u0430 ".concat(level * 10, "%"));
});
// Создаем менеджер и добавляем скиллы
var skillManager = new skillManager_1.SkillManager();
skillManager.addSkill(fireball);
skillManager.addSkill(dash);
// Выдаем 2 очка навыков
skillManager.grantSkillPoint();
skillManager.grantSkillPoint();
console.log('Текущее количество очков:', skillManager.getSkillPoints());
// Повышаем уровень скилла "Огненный шар"
var leveledUp = skillManager.levelUpSkill('fireball');
if (leveledUp) {
    console.log("\u041D\u0430\u0432\u044B\u043A \u043E\u0433\u043D\u0435\u043D\u043D\u044B\u0439 \u0448\u0430\u0440 \u0442\u0435\u043F\u0435\u0440\u044C \u0443\u0440\u043E\u0432\u043D\u044F ".concat((_a = skillManager.getSkill('fireball')) === null || _a === void 0 ? void 0 : _a.currentLevel));
}
// Повышаем уровень скилла "Рывок"
skillManager.levelUpSkill('dash');
console.log("\u041D\u0430\u0432\u044B\u043A \u0440\u044B\u0432\u043E\u043A \u0442\u0435\u043F\u0435\u0440\u044C \u0443\u0440\u043E\u0432\u043D\u044F ".concat((_b = skillManager.getSkill('dash')) === null || _b === void 0 ? void 0 : _b.currentLevel));
// Проверяем сколько осталось очков
console.log('Оставшиеся очки навыков:', skillManager.getSkillPoints());
// Можно также вызвать эффект скилла на примере цели
var dummyTarget = {
    takeDamage: function (amount) {
        console.log("\u0426\u0435\u043B\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u0430 \u0443\u0440\u043E\u043D: ".concat(amount));
    }
};
(_c = skillManager.getSkill('fireball')) === null || _c === void 0 ? void 0 : _c.applyEffect(dummyTarget);
