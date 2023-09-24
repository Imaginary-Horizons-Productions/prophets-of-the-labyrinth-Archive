const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { generateRandomNumber } = require('../../helpers.js');
const { addModifier } = require('../combatantDAO.js');
const { getWeakness, elementsList } = require('../elementHelpers.js');

module.exports = new EquipmentTemplate("Sabotage Kit", "Afflict a foe with @{mod0Stacks} @{mod0} and a random weakness", "Slow and Weakness +@{critBonus}", "Earth", effect)
	.setCategory("Weapon")
	.setUpgrades("Long Sabotage Kit")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Slow", stacks: 2 }, { name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 4 }])
	.setCost(200)
	.setUses(15)
	.setFlavorText({ name: "Eligible Weaknesses", value: "The rolled weakness won't be one of the target's resistances or existing weaknesses" });

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [slow, elementStagger, critSlow] } = module.exports;
	// filter out target's resistances and existing weaknesses
	const weaknessPool = elementsList().filter(element => element !== target.element && element !== getWeakness(target.element) && !(`${element} Weakness` in target.modifiers));
	const rolledWeakness = `${weaknessPool[generateRandomNumber(adventure, weaknessPool.length, "battle")]} Weakness`;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critSlow);
		if (weaknessPool.length > 0) {
			addModifier(target, { name: rolledWeakness, stacks: 4 });
		}
	} else {
		addModifier(target, slow);
		if (weaknessPool.length > 0) {
			addModifier(target, { name: rolledWeakness, stacks: 2 });
		}
	}
	return `${target.getName(adventure.room.enemyIdMap)} is Slowed, Staggered${weaknessPool.length > 0 ? `, and gains ${rolledWeakness}` : ""}.`;
}
