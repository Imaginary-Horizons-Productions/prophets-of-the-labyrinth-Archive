const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require('../combatantDAO.js');

module.exports = new Weapon("shieldbash", "Deal damage equal to your block (crit: more damage)", "earth", effect)
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let damage = user.block;
	if (user.element === element) {
		damage = Math.ceil(damage * 1.5);
	}
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, element, adventure);
}
