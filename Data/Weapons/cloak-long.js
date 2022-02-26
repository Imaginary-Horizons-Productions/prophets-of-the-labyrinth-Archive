const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Long Cloak", 2, "*Gain @{mod1Stacks} @{mod1}*\nCritical Hit: Gain @{mod2Stacks} @{mod2}", "Wind", effect, ["Swift Cloak", "Thick Cloak"])
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 3 }, { name: "Evade", stacks: 4 }])
	.setCost(350)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, evade, critEvade] } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, critEvade);
	} else {
		addModifier(user, evade);
	}
	return ""; // result as text
}
