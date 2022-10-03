const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new EquipmentTemplate("Mercurial Firecracker", "*Strike 3 random foes for @{damage} damage matching the user's element*\nCritical Hit: Damage x@{critBonus}", "Fire", effect, ["Double Firecracker", "Toxic Firecracker"])
	.setCategory("Weapon")
	.setTargetingTags({ target: `random${SAFE_DELIMITER}3`, team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
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
	return dealDamage(target, user, damage, false, user.element, adventure);
}
