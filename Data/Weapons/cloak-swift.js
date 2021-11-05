const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Swift Cloak", "Evade an incoming attack, then gain Quicken (crit: gain more evade and quicken)", "wind", effect, [])
	.setTargetingTags({ target: "self", team: "self" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	if (user.element === element) {
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
