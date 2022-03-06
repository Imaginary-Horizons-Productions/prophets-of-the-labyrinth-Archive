const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Swift Midas Staff", 2, "*Apply @{mod1Stacks} @{mod1} to a combatant, then gain $${mod2Stacks} @{mod2}*\nCritical Hit: @{mod1} x@{critBonus}", "Water", effect, ["Soothing Midas Staff"])
	.setTargetingTags({ target: "single", team: "any" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Curse of Midas", stacks: 1 }, { name: "Quicken", stacks: 1 }, { name: "Curse of Midas", stacks: 2 }])
	.setCost(350)
	.setUses(10);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, curse, quicken, critCurse] } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critCurse);
	} else {
		addModifier(target, curse);
	}
	addModifier(user, quicken);
	return "";
}
