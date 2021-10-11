const Weapon = require('../../Classes/Weapon.js');
const { dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("chargingslash", "Deal additional damage to a target if not blocking (crit: more damage)", "fire", effect)
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75;
	if (user.block === 0) {
		damage = 150;
	}
	if (user.element === element) {
		damage *= 1.5;
	}
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, damage, element, adventure);
}
