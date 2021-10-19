const Weapon = require('../../Classes/Weapon.js');
const { dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("shieldbash", "Deal damage equal to your block (crit: more damage)", "earth", effect)
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let damage = user.block;
	if (user.element === element) {
		damage *= 1.5;
	}
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, user, damage, element, adventure);
}
