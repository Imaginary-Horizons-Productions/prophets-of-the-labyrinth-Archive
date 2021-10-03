const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require('../combatantDAO.js');

module.exports = new Weapon("backstab", "Deal additional damage to a target without block (crit: more damage)", "wind", effect)
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 50;
	if (target.block === 0) {
		damage = 125;
	}
	if (user.element === element) {
		damage = Math.ceil(damage * 1.5);
	}
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, element, adventure);
}
