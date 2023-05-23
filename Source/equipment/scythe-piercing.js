const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Piercing Scythe", "*Strike a foe for @{damage} @{element} unblockable damage; instant death if foe is at or below @{bonusDamage} hp*\nCritical Hit💥: Instant death threshold x@{critBonus}", "Wind", effect, ["Lethal Scythe", "Toxic Scythe"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(99);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger], damage, bonusDamage: hpThreshold, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		hpThreshold *= critBonus;
	}
	if (target.hp > hpThreshold) {
		return dealDamage(target, user, damage, true, element, adventure);
	} else {
		target.hp = 0;
		return `${getFullName(target, adventure.room.enemyTitles)} meets the reaper.`;
	}
}
