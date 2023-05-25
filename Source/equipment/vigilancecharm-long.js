const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Long Vigilance Charm", "Gain @{mod1Stacks} @{mod1}", "@{mod1} +@{bonus}", "Earth", effect, ["Devoted Vigilance Charm", "Guarding Vigilance Charm"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 4 }])
	.setBonus(2) // Vigilance stacks
	.setCost(350)
	.setUses(5);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, vigilance], bonus } = module.exports;
	const pendingVigilance = { ...vigilance, stacks: vigilance.stacks + (isCrit ? bonus : 0) };
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	addModifier(user, pendingVigilance);
	return ""; // result as text
}
