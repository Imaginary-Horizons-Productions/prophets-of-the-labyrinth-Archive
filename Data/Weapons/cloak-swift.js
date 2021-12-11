const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Swift Cloak", 2, "*Gain 1 evade and 2 Quicken*\nCritical Hit: Gain 1 additional evade and Quicken", "Wind", effect, ["Long Cloak", "Thick Cloak"])
	.setTargetingTags({ target: "self", team: "self" })
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(user, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(user, "evade", 2);
		addModifier(user, "Quicken", 3);
	} else {
		addModifier(user, "evade", 1);
		addModifier(user, "Quicken", 2);
	}
	return ""; // result as text
}
