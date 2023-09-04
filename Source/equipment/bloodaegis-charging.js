const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addBlock, addModifier, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Charging Blood Aegis", "Pay @{hpCost} hp; gain @{block} block, @{mod1Stacks} @{mod1}, intercept a later single target move", "Block x@{critBonus}", "Water", effect, ["Heavy Blood Aegis", "Sweeping Blood Aegis"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setHpCost(25)
	.setBlock(125);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp], block, critBonus, hpCost } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(user, block);
	addModifier(user, powerUp);
	const targetMove = adventure.room.moves.find(move => {
		const moveUser = adventure.getCombatant(move.userReference);
		return moveUser.name === target.name && moveUser.title === target.title;
	});
	if (targetMove.targets.length === 1) {
		targetMove.targets = [{ team: user.team, index: user.findMyIndex(adventure) }];
		return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Powered Up. ${target.getName(adventure.room.enemyIdMap)} falls for the provocation.`;
	} else {
		return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	}
}
