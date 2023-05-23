const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Vigilance Charm", "*Gain @{mod1Stacks} @{mod1}*\nCritical Hit💥: Gain @{mod2Stacks} @{mod2}", "Earth", effect, ["Long Vigilance Charm", "Devoted Vigilance Charm", "Guarding Vigilance Charm"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 3 }, { name: "Vigilance", stacks: 5 }])
	.setCost(200)
	.setUses(5);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, vigilance, critVigilance] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, critVigilance);
	} else {
		addModifier(user, vigilance);
	}
	return ""; // result as text
}
