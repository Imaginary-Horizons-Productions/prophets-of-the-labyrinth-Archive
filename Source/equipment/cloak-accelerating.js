const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Accelerating Cloak", "Gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}", "@{mod1} +@{bonus} and @{mod2} +@{bonus}", "Wind", effect, ["Long Cloak", "Thick Cloak"])
	.setCategory("Armor")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Quicken", stacks: 1 }])
	.setBonus(1) // Evade stacks
	.setCost(350)
	.setUses(10);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, evade, quicken], bonus } = module.exports;
	const pendingEvade = { ...evade, stacks: evade.stacks + (isCrit ? bonus : 0) };
	const pendingQuicken = { ...quicken, stacks: quicken.stacks + (isCrit ? bonus : 0) };
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	addModifier(user, pendingEvade);
	addModifier(user, pendingQuicken);
	return `${user.getName(adventure.room.enemyIdMap)} is prepared to Evade and Quickened.`;
}
