const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Daggers", "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Wind", effect, ["Sharpened Daggers", "Sweeping Daggers", "Wicked Daggers"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75)
	.setCritBonus(3);

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
