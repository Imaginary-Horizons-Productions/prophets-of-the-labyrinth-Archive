const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Cloak", "Gain @{mod1Stacks} @{mod1}", "@{mod2} +@{bonus}", "Wind", effect, ["Accelerating Cloak", "Long Cloak", "Thick Cloak"])
	.setCategory("Armor")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }])
	.setBonus(1) // Evade stacks
	.setCost(350)
	.setUses(10);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, evade], bonus } = module.exports;
	const pendingEvade = { ...evade, stacks: evade.stacks + (isCrit ? bonus : 0) };
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	addModifier(user, pendingEvade);
	return ""; // result as text
}
