const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Long Cloak", 2, "*Gain 2 evade*\nCritical Hit: Gain 1 additional evade", "Wind", effect, ["Swift Cloak", "Thick Cloak"])
	.setTargetingTags({ target: "self", team: "self" })
	.setCost(350)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(user, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(user, "evade", 3);
	} else {
		addModifier(user, "evade", 2);
	}
	return ""; // result as text
}
