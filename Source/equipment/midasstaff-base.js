const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Midas Staff", "*Apply @{mod1Stacks} @{mod1} to a combatant*\nCritical Hit: @{mod1} x@{critBonus}", "Water", effect, ["Accelerating Midas Staff", "Soothing Midas Staff"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "any" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Curse of Midas", stacks: 1 }, { name: "Curse of Midas", stacks: 2 }])
	.setCost(200)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, curse, critCurse] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critCurse);
	} else {
		addModifier(target, curse);
	}
	return "";
}
