const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require('../combatantDAO.js');

module.exports = new Weapon("chameleonsword", "Deal damage matching the element of the wielder (crit: more damage)", "untyped", effect)
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75;
	// No same element effect boost due to untyped
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, user.element, adventure);
}
