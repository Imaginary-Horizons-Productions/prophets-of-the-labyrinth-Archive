const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, getFullName } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Wicked Daggers", "Strike a foe for @{damage} (+@{bonusDamage} if foe has 0 block) @{element} damage", "Damage x@{critBonus}", "Wind", effect, ["Sharpened Daggers", "Sweeping Daggers"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setCritBonus(3)
	.setDamage(75)
	.setBonusDamage(50);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger], damage, bonusDamage, critBonus } = module.exports;
	if (target.block === 0) {
		damage += bonusDamage;
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
