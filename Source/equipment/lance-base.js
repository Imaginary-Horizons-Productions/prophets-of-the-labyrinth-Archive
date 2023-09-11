const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Lance", "Strike a foe for @{damage} @{element} damage (double increase from Power Up)", "Damage x@{critBonus}", "Earth", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Accelerating Lance", "Piercing Lance", "Vigilant Lance")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	const powerUpStacks = user.getModifierStacks("Power Up");
	damage += powerUpStacks;
	if (isCrit) {
		damage *= critBonus;
		damage += powerUpStacks;
	}
	return dealDamage([target], user, damage, false, element, adventure);
}
