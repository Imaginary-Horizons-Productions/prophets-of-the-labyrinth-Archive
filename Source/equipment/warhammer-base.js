const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Warhammer", "*Strike a foe for @{damage} (+@{bonusDamage} if foe is already stunned) @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Earth", effect, ["Piercing Warhammer"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(100)
	.setBonusDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, bonusDamage, critBonus } = module.exports;
	if (target.getModifierStacks("Stun") > 0) {
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
