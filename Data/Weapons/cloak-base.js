const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Cloak", 1, "*Gain 1 evade*\nCritical Hit: Gain 1 additional evade", "Wind", effect, ["Long Cloak", "Swift Cloak", "Thick Cloak"])
	.setTargetingTags({ target: "self", team: "self" })
	.setCost(350)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(user, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(user, "evade", 2);
	} else {
		addModifier(user, "evade", 1);
	}
	return ""; // result as text
}
