const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("cloak", "Evade an incoming attack (crit: evade another attack)", "wind", effect, [])
	.setTargetingTags({ target: "self", team: "self" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	if (user.element === element) {
		removeModifier(user, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(user, "evade", 2);
	} else {
		addModifier(user, "evade", 1);
	}
	return ""; // result as text
}
