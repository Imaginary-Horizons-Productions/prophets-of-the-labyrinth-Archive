const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Sharpened Daggers", "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Wind", effect, ["Sweeping Daggers", "Wicked Daggers"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setCritBonus(3)
	.setDamage(100);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
