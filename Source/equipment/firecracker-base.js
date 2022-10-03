const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new EquipmentTemplate("Firecracker", "*Strike 3 random foes for @{damage} @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Fire", effect, ["Double Firecracker", "Mercurial Firecracker", "Toxic Firecracker"])
	.setCategory("Weapon")
	.setTargetingTags({ target: `random${SAFE_DELIMITER}3`, team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(5)
	.setCritBonus(2)
	.setDamage(50);

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
