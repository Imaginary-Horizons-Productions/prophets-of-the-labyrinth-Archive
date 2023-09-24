const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, compareMoveSpeed } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Reactive Warhammer", "Strike a foe for @{damage} (+@{bonus} if foe is currently stunned or if going after foe) @{element} damage", "Damage x@{critBonus}", "Earth", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Piercing Warhammer", "Slowing Warhammer")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setDamage(75)
	.setBonus(75); // damage

function effect([target], user, isCrit, adventure) {
	const { element, modifiers: [elementStagger], damage, bonus, critBonus } = module.exports;
	let pendingDamage = damage;
	if (target.getModifierStacks("Stun") > 0) {
		pendingDamage += bonus;
	}
	const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === user.findMyIndex(adventure));
	const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === target.findMyIndex(adventure));

	if (compareMoveSpeed(userMove, targetMove) > 0) {
		pendingDamage += bonus;
	}

	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		pendingDamage *= critBonus;
	}
	return dealDamage([target], user, pendingDamage, false, element, adventure);
}
