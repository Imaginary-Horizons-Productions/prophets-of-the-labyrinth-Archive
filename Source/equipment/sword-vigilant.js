const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, addBlock, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Vigilant Sword", "Strike a foe for @{damage} @{element} damage (double increase from Power Up), then gain @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Earth", effect, ["Accelerating Sword", "Piercing Sword"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 2 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBlock(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, vigilance], damage, block, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	const powerUpStacks = user.getModifierStacks("Power Up");
	damage += powerUpStacks;
	if (isCrit) {
		damage *= critBonus;
		damage += powerUpStacks;
	}
	addBlock(user, block);
	addModifier(user, vigilance);
	return dealDamage(target, user, damage, false, element, adventure);
}