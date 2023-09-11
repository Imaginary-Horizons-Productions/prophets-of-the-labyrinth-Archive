const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Midas Staff", "Apply @{mod1Stacks} @{mod1} to a combatant", "@{mod1} +@{bonus}", "Water", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "any" })
	.setUpgrades("Accelerating Midas Staff", "Soothing Midas Staff")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Curse of Midas", stacks: 1 }])
	.setBonus(1) // Curse of Midas stacks
	.setCost(200)
	.setUses(10);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, curse], bonus } = module.exports;
	const pendingCurse = { ...curse, stacks: curse.stacks + (isCrit ? bonus : 0) };
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	addModifier(target, pendingCurse);
	return `${target.getName(adventure.room.enemyIdMap)} gains Curse of Midas.`;
}
