const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Sword", "*Strike a foe for @{damage} @{element} damage and gain @{mod1Stacks} @{mod1}*\nCritical Hit💥: Damage x@{critBonus}", "Earth", effect, ["Accelerating Sword", "Guarding Sword", "Reckless Sword"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, false, element, adventure);
}
