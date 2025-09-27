import { Skill } from '../Skills/skill';
import {skillData} from '../Skills/skillsData'
export class SkillGenerator {
    private skillData = skillData
    constructor() {}

    generateSkillById(id: string): Skill | null {
        const data = this.skillData.find(s => s.id === id);
        if (!data) return null;

        return new Skill(
            data.id,
            data.name,
            data.description,
            data.maxLevel,
            0,
            data.iconKey,
            data.cooldown,
            data.effect
        );
    }

    generateAllSkills(): Skill[] {
        return this.skillData.map(data =>
            new Skill(data.id, data.name, data.description, data.maxLevel, 0, data.iconKey,data.cooldown, data.effect)
        );
    }

    // private skillData = [
    //     {
    //         id: 'fireball',
    //         name: 'Огненный шар',
    //         description: 'Наносит урон огнём врагу.',
    //         maxLevel: 5,
    //         effect: (target: any, level: number) => {
    //             target?.takeDamage?.(level * 20);
    //         }
    //     },
    //     {
    //         id: 'dash',
    //         name: 'Рывок',
    //         description: 'Мгновенно ускоряет вперёд.',
    //         maxLevel: 3,
    //         effect: (target: any, level: number) => {
    //             console.log(`Ускорение на ${level * 10}%`);
    //         }
    //     },
    // ];
}
