const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Punch", "Strike a foe for @{damage} @{element} damage", "Damage x@{critBonus}", "Untyped", needsLivingTargets(effect))
	.setCategory("Technique")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([])
	.setCost(0)
	.setUses(Infinity)
	.setDamage(35);

function effect([target], user, isCrit, adventure) {
	let { damage, critBonus, element } = module.exports;
	const ironFistStacks = user.getModifierStacks("Iron Fist Stance");
	const pendingElement = ironFistStacks > 0 ? user.element : element;
	const floatingMistStacks = user.getModifierStacks("Floating Mist Stacks");
	let totalStagger = floatingMistStacks * 2;
	let pendingDamage = damage + (ironFistStacks * 45);
	if (user.element === pendingElement) {
		totalStagger++;
	}
	if (isCrit) {
		pendingDamage *= critBonus;
	}
	if (totalStagger > 0) {
		addModifier(target, { name: "Stagger", stacks: totalStagger });
	}
	return dealDamage([target], user, pendingDamage, false, pendingElement, adventure);
}
