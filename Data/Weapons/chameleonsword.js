const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require('../combatantDAO.js');

module.exports = new Weapon("chameleonsword", "Deal damage matching the element of the wielder (crit: more damage)", "element", effect)
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75;
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, user.element, adventure);
}
