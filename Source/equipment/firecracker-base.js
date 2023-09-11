const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new EquipmentTemplate("Firecracker", "Strike 3 random foes for @{damage} @{element} damage", "Damage x@{critBonus}", "Fire", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: `random${SAFE_DELIMITER}3`, team: "enemy" })
	.setUpgrades("Double Firecracker", "Mercurial Firecracker", "Toxic Firecracker")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(15)
	.setCritBonus(2)
	.setDamage(50);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
	if (isCrit) {
		damage *= critBonus;
	}
	return Promise.all(targets.map(target => {
		if (target.hp < 1) {
			return "";
		}

		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})).then(results => results.filter(result => Boolean(result)).join(" "));
}
