const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addBlock, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Blood Aegis", "Pay @{hpCost} hp; gain @{block} block and intercept a later single target move", "Block x@{critBonus}", "Water", effect, ["Charging Blood Aegis", "Heavy Blood Aegis", "Sweeping Blood Aegis"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setHpCost(25)
	.setBlock(125);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus, hpCost } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(user, block);
	const targetMove = adventure.room.moves.find(move => {
		const moveUser = adventure.getCombatant(move.userReference);
		return moveUser.name === target.name && moveUser.title === target.title;
	});
	if (targetMove.targets.length === 1) {
		let userTeam = "delver";
		let userCombatantPool = adventure.delvers;
		if (user.archetype == "@{clone}") {
			userTeam = "enemy";
			userCombatantPool = adventure.room.enemies;
		}
		const userIndex = userCombatantPool.findIndex(combatant => combatant.id === user.id && combatant.name === user.name);
		targetMove.targets = [{ team: userTeam, index: userIndex }];
		return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${target.getName(adventure.room.enemyIdMap)} falls for the provocation.`;
	} else {
		return `Preparing to Block, ${payHP(user, hpCost, adventure)}`;
	}
}
