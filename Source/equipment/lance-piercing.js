const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Piercing Lance", "Strike a foe for @{damage} @{element} unblockable damage (double increase from Power Up)", "Damage x@{critBonus}", "Earth", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Accelerating Lance", "Vigilant Lance")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
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
	return dealDamage([target], user, damage, true, element, adventure);
}
