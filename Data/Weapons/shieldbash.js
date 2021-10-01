const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require('../combatantDAO.js');

module.exports = new Weapon("shieldbash", "Deal damage equal to your block (crit: more damage)", "earth", effect)
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let damage = user.block;
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, element, adventure);
}
