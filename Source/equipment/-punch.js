const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Punch", "Strike a foe for @{damage} @{element} damage", "Damage x@{critBonus}", "Untyped", effect, [])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([])
	.setCost(0)
	.setUses(Infinity)
	.setDamage(50);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { damage, critBonus, element } = module.exports;
	// No same element effect boost due to untyped
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
