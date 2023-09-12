const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Punch", "Strike a foe for @{damage} @{element} damage", "Damage x@{critBonus}", "Untyped", effect)
	.setCategory("Technique")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([])
	.setCost(0)
	.setUses(Infinity)
	.setDamage(35);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { damage, critBonus, element } = module.exports;
	const ironFistStacks = user.getModifierStacks("Iron Fist Stance");
	const floatingMistStacks = user.getModifierStacks("Floating Mist Stacks");
	let totalStagger = ironFistStacks * 2 + floatingMistStacks * 2;
	const pendingDamage = damage + (ironFistStacks * 45);
	if (user.element === element) {
		totalStagger++;
	}
	if (isCrit) {
		damage *= critBonus;
	}
	if (totalStagger > 0) {
		addModifier(target, { name: "Stagger", stacks: totalStagger });
	}
	return dealDamage([target], user, pendingDamage, false, element, adventure);
}
