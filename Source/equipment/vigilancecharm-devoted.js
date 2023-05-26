const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Devoted Vigilance Charm", "Grant an ally @{mod1Stacks} @{mod1}", "@{mod1} +@{bonus}", "Earth", effect, ["Long Vigilance Charm", "Guarding Vigilance Charm"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 3 }])
	.setBonus(2) // Vigilance stacks
	.setCost(350)
	.setUses(5);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, vigilance], bonus } = module.exports;
	const pendingVigilance = { ...vigilance, stacks: vigilance.stacks + (isCrit ? bonus : 0) };
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	addModifier(target, pendingVigilance);
	return ""; // result as text
}
