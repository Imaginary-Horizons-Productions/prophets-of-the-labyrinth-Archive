const Weapon = require('../../Classes/Weapon.js');
const { dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Punch", "description", "untyped", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(0)
	.setDamage(50);

function effect(target, user, isCrit, element, adventure) {
	let { damage, critMultiplier } = module.exports;
	// No same element effect boost due to untyped
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, element, adventure);
}
