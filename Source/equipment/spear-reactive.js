const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier, compareMoveSpeed } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Reactive Spear", "Strike a foe for @{damage} (+@{bonus} if foe went first) @{element} damage", "Also inflict @{mod1Stacks} @{mod1}", "Wind", effect, ["Lethal Spear", "Sweeping Spear"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(100)
	.setBonus(75); // damage

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, critStagger], damage, bonus } = module.exports;
	let userTeam = "delver";
	let userCombatantPool = adventure.delvers;
	let targetTeam = "enemy";
	let targetCombatantPool = adventure.room.enemies;
	if (user.archtype === "@{clone}") {
		userTeam = "enemy";
		userCombatantPool = adventure.room.enemies;
		targetTeam = "delver";
		targetCombatantPool = adventure.delvers;
	}
	const userIndex = userCombatantPool.findIndex(combatant => combatant.id === user.id);
	const userMove = adventure.room.moves.find(move => move.userReference.team === userTeam && move.userReference.index === userIndex);
	const targetIndex = targetCombatantPool.findIndex(combatant => combatant.id === target.id);
	const targetMove = adventure.room.moves.find(move => move.userReference.team === targetTeam && move.userReference.index === targetIndex);

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
