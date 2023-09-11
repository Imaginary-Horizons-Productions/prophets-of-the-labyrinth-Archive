const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, gainHealth, compareMoveSpeed } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Reactive Life Drain", "Strike a foe for @{damage} (+@{bonus} if foe went first) @{element} damage, then gain @{healing} hp", "Healing x@{critBonus}", "Water", effect)
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Flanking Life Drain", "Urgent Life Drain")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setHealing(25)
	.setBonus(50); // damage

async function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger], damage, bonus, healing, critBonus } = module.exports;
	const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === user.findMyIndex(adventure));
	const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === target.findMyIndex(adventure));

	if (compareMoveSpeed(userMove, targetMove) > 0) {
		damage += bonus;
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		healing *= critBonus;
	}
	return `${await dealDamage([target], user, damage, false, element, adventure)} ${gainHealth(user, healing, adventure)}`;
}
