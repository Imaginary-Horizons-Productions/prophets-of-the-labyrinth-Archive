const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, addBlock } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Vigilant Lance", "Strike a foe for @{damage} @{element} damage (double increase from Power Up), then gain @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Earth", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Accelerating Lance", "Piercing Lance")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 2 }])
	.setCost(350)
	.setUses(15)
	.setDamage(75)
	.setBlock(75);

function effect([target], user, isCrit, adventure) {
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
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		return `${damageText} ${user.getName(adventure.room.enemyIdMap)} gains Vigilance`;
	});
}
