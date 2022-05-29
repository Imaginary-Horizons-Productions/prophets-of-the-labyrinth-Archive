const Equipment = require('../../Classes/Equipment.js');
const { dealDamage } = require('../combatantDAO.js');

module.exports = new Equipment("Punch", -1, "description", "Untyped", effect, [])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([])
	.setCost(0)
	.setUses(0)
	.setDamage(50);

function effect(target, user, isCrit, adventure) {
	let { damage, critBonus, element } = module.exports;
	// No same element effect boost due to untyped
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
