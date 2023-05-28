const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addBlock, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Sweeping Blood Aegis", "Pay @{hpCost} hp to gain @{block} block and force all enemies using single target moves to target you if they move after you", "Block x@{critBonus}", "Water", effect, ["Charging Blood Aegis", "Heavy Blood Aegis"])
	.setCategory("Pact")
	.setTargetingTags({ target: "all", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setHpCost(25)
	.setBlock(100);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus, hpCost } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(user, block);

	const userIndex = adventure.delvers.findIndex(delver => delver.id === user.id);
	const provokedEnemies = [];
	adventure.moves.forEach(move => {
		if (move.userReference.team === "enemy" && move.targets.length === 1) {
			const enemy = adventure.getCombatant(move.userReference);
			if (enemy.hp > 0) {
				move.targets = [{ team: "delver", index: userIndex }];
				provokedEnemies.push(getFullName(enemy, adventure.room.enemyTitles));
			}
		}
	})

	if (provokedEnemies.length > 0) {
		return `${payHP(user, hpCost, adventure)} ${provokedEnemies.join(", ")} fall(s) for the provocation.`;
	} else {
		return payHP(user, hpCost, adventure);
	}
}
