const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Long Cloak", "*Gain 2 evade*\nCritical Hit: Gain 1 additional evade", "Wind", effect, [])
	.setTargetingTags({ target: "self", team: "self" })
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
