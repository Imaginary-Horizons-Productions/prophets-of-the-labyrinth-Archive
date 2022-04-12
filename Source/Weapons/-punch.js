const Weapon = require('../../Classes/Weapon.js');
const { dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Punch", -1, "description", "Untyped", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([])
	.setCost(0)
	.setUses(0)
	.setDamage(50);

function effect(target, user, isCrit, adventure) {
	let { damage, critBonus, element : weaponElement } = module.exports;
	// No same element effect boost due to untyped
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
