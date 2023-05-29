const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addBlock, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Heavy Blood Aegis", "Pay @{hpCost} hp; gain @{block} block and intercept a later single target move", "Block x@{critBonus}", "Water", effect, ["Charging Blood Aegis", "Sweeping Blood Aegis"])
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setHpCost(25)
	.setBlock(250);

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
		const userIndex = adventure.delvers.findIndex(delver => delver.id === user.id);
		targetMove.targets = [{ team: "delver", index: userIndex }];
		return `${payHP(user, hpCost, adventure)} ${getFullName(target, adventure.room.enemyTitles)} falls for the provocation.`;
	} else {
		return payHP(user, hpCost, adventure);
	}
}
