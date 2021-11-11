const Weapon = require('../../Classes/Weapon.js');
const { dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Punch", "description", "untyped", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(0);

function effect(target, user, isCrit, element, adventure) {
	let damage = 50;
	// No same element effect boost due to untyped
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, user, damage, element, adventure).then(damageText => {
		return damageText;
	});
}
