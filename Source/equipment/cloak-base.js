const Equipment = require('../../Classes/Equipment.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Cloak", 1, "*Gain @{mod1Stacks} @{mod1}*\nCritical Hit: Gain @{mod2Stacks} @{mod2}", "Wind", effect, ["Long Cloak", "Swift Cloak", "Thick Cloak"])
	.setCategory("Armor")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Evade", stacks: 3 }])
	.setCost(350)
	.setUses(10);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, evade, critEvade] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, critEvade);
	} else {
		addModifier(user, evade);
	}
	return ""; // result as text
}
