const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addModifier, payHP } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Infinite Regeneration", "Pay @{hpCost} hp to grant an ally @{mod1Stacks} @{mod1}", "HP Cost / @{critBonus}", "Earth", needsLivingTargets(effect))
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "delver" })
	.setUpgrades("Discounted Infinite Regeneration", "Fate Sealing Infinite Regeneration")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Regen", stacks: 3 }])
	.setHpCost(50)
	.setCost(200)
	.setUses(10);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, regen], hpCost, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		hpCost /= critBonus;
	}
	addModifier(target, regen);
	return `${payHP(user, hpCost, adventure)} ${user.getName(adventure.room.enemyIdMap)} gains Regen.`;
}
