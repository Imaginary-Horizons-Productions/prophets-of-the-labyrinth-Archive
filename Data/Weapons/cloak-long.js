const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Long Cloak", "Evade two incoming attacks (crit: evade another attack)", "Wind", effect, [])
	.setTargetingTags({ target: "self", team: "self" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	if (user.element === element) {
		removeModifier(user, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(user, "evade", 3);
	} else {
		addModifier(user, "evade", 2);
	}
	return ""; // result as text
}
