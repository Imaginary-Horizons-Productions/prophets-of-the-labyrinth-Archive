const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addBlock, payHP } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Sweeping Blood Aegis", "Pay @{hpCost} hp; gain @{block} block and intercept all later single target moves", "Block x@{critBonus}", "Water", needsLivingTargets(effect))
	.setCategory("Pact")
	.setTargetingTags({ target: "all", team: "enemy" })
	.setSidegrades("Charging Blood Aegis", "Heavy Blood Aegis")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(15)
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

	const provokedTargets = [];
	const targetTeam = user.team === "delver" ? "enemy" : "delver";
	const userIndex = user.findMyIndex(adventure);
	adventure.moves.forEach(move => {
		if (move.userReference.team === targetTeam && move.targets.length === 1) {
			const target = adventure.getCombatant(move.userReference);
			move.targets = [{ team: user.team, index: userIndex }];
			provokedTargets.push(target.getName(adventure.room.enemyIdMap));
		}
	})

	if (provokedTargets.length > 0) {
		return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${provokedTargets.join(", ")} fall(s) for the provocation.`;
	} else {
		return `Preparing to Block, ${payHP(user, hpCost, adventure)}`;
	}
}
