const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Accelerating Sword", "*Strike a foe for @{damage} @{element} damage, then gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}*\nCritical Hit: Damage x@{critBonus}", "Earth", effect, ["Guarding Sword", "Reckless Sword"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }, { name: "Quicken", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp, quicken], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, quicken);
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, false, element, adventure);
}
