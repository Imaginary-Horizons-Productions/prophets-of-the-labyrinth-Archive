const Equipment = require('../../Classes/Equipment.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Equipment("Wicked Daggers", 2, "*Strike a foe for @{damage} (+@{bonusDamage} if foe has 0 block) @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Wind", effect, ["Sharpened Daggers", "Sweeping Daggers"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setCritBonus(3)
	.setDamage(75)
	.setBonusDamage(50);

function effect(target, user, isCrit, adventure) {
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
