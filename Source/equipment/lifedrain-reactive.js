const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, gainHealth, compareMoveSpeed } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Reactive Life Drain", "Strike a foe for @{damage} (+@{bonus} if foe went first) @{element} damage, then gain @{healing} hp", "Healing x@{critBonus}", "Water", effect, ["Flanking Life Drain", "Urgent Life Drain"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
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
	let userTeam = "delver";
	let userCombatantPool = adventure.delvers;
	let targetTeam = "enemy";
	let targetCombatantPool = adventure.room.enemies;
	if (user.archetype === "@{clone}") {
		userTeam = "enemy";
		userCombatantPool = adventure.room.enemies;
		targetTeam = "delver";
		targetCombatantPool = adventure.delvers;
	}
	const userIndex = userCombatantPool.findIndex(combatant => combatant.id === user.id && combatant.name === user.name);
	const userMove = adventure.room.moves.find(move => move.userReference.team == userTeam && move.userReference.index == userIndex);
	const targetIndex = targetCombatantPool.findIndex(combatant => combatant.id === target.id && combatant.name === target.name);
	const targetMove = adventure.room.moves.find(move => move.userReference.team == targetTeam && move.userReference.index == targetIndex);

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
