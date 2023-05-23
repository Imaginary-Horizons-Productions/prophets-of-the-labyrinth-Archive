const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier, addBlock } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Guarding Vigilance Charm", "*Gain @{mod1Stacks} @{mod1} and @{block} block*\nCritical Hit💥: Gain @{mod2Stacks} @{mod2} and Block x@{critBonus}", "Earth", effect, ["Long Vigilance Charm", "Guarding Vigilance Charm"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 3 }, { name: "Vigilance", stacks: 5 }])
	.setCost(350)
	.setBlock(60)
	.setUses(5);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, vigilance, critVigilance], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, critVigilance);
		block *= critBonus;
	} else {
		addModifier(user, vigilance);
	}
	addBlock(user,block)
	return ""; // result as text
}
