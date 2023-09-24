const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, compareMoveSpeed } = require("../combatantDAO.js");
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Reactive Spear", "Strike a foe for @{damage} (+@{bonus} if foe went first) @{element} damage", "Also inflict @{mod1Stacks} @{mod1}", "Wind", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Lethal Spear", "Sweeping Spear")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setDamage(100)
	.setBonus(75); // damage

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, critStagger], damage, bonus } = module.exports;
	const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === user.findMyIndex(adventure));
	const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === target.findMyIndex(adventure));

	if (compareMoveSpeed(userMove, targetMove) > 0) {
		damage += bonus;
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critStagger);
	}
	return dealDamage([target], user, damage, false, element, adventure);
}
