const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { generateRandomNumber } = require('../../helpers.js');
const { addModifier } = require('../combatantDAO.js');
const { getWeakness } = require('../elementHelpers.js');

module.exports = new EquipmentTemplate("Sabotage Kit", "Afflict a foe with @{mod0Stacks} @{mod0}, @{mod1Stacks} @{mod1}, and a random weakness", "Slow and Weakness +@{critBonus}", "Earth", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Slow", stacks: 2 }, { name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 4 }])
	.setCost(200)
	.setUses(15);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [slow, stagger, critSlow] } = module.exports;
	const weaknessPool = [
		"Earth",
		"Fire",
		"Untyped",
		"Water",
		"Wind"
	].filter(element => element !== getWeakness(target.element) && !(`${element} Weakness` in target.modifiers));
	const rolledWeakness = `${weaknessPool[generateRandomNumber(adventure, weaknessPool.length, "battle")]} Weakness`;
	let totalStagger = stagger.stacks;
	if (user.element === element) {
		totalStagger++;
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
	addModifier(target, { name: "Stagger", stacks: totalStagger });
	return `${target.getName(adventure.room.enemyIdMap)} is Slowed, Staggered${weaknessPool.length > 0 ? `, and gains ${rolledWeakness}` : ""}.`;
}
