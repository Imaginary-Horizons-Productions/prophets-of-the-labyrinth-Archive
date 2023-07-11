const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Accelerating Midas Staff", "Apply @{mod1Stacks} @{mod1} to a combatant, then gain @{mod2Stacks} @{mod2}", "@{mod1} +@{bonus}", "Water", effect, ["Soothing Midas Staff"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "any" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Curse of Midas", stacks: 1 }, { name: "Quicken", stacks: 1 }])
	.setBonus(1) // Curse of Midas stacks
	.setCost(350)
	.setUses(5);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, curse, quicken], bonus } = module.exports;
	const pendingCurse = { ...curse, stacks: curse.stacks + (isCrit ? bonus : 0) };
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	addModifier(target, pendingCurse);
	addModifier(user, quicken);
	return `${target.getName(adventure.room.enemyIdMap)} gains Curse of Midas. ${user.getName(adventure.room.enemyIdMap)} is Quickened.`;
}
