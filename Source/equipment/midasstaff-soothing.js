const Equipment = require('../../Classes/Equipment.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Soothing Midas Staff", 2, "*Apply @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} to a combatant*\nCritical Hit: @{mod1} x@{critBonus}", "Water", effect, ["Swift Midas Staff"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "any" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Curse of Midas", stacks: 1 }, { name: "Regen", stacks: 2 }, { name: "Curse of Midas", stacks: 2 }])
	.setCost(350)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, curse, regen, critCurse] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critCurse);
	} else {
		addModifier(target, curse);
	}
	addModifier(target, regen);
	return "";
}
