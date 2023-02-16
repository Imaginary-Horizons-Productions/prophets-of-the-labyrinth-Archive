const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Sickle", "*Strike a foe for @{damage} (+5% foe max hp) @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Water", effect, ["Hunter's Sickle", "Sharpened Sickle", "Thick Sickle"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
	damage += (0.05 * target.maxHp);
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
