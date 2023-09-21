const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { removeModifier, addModifier, payHP } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Fate Sealing Infinite Regeneration", "Pay @{hpCost} hp to grant an ally @{mod1Stacks} @{mod1}", "HP Cost / @{critBonus} and grant @{mod2Stacks} @{mod2}", "Earth", effect)
	.setCategory("Pact")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Regen", stacks: 3 }, { name: "Stasis", stacks: 1 }])
	.setHpCost(50)
	.setCost(350)
	.setUses(10);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, regen, stasis], hpCost, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		hpCost /= critBonus;
		addModifier(target, stasis);
	}
	addModifier(target, regen);
	return `${payHP(user, hpCost, adventure)} ${user.getName(adventure.room.enemyIdMap)} gains Regen${isCrit ? " and enters Stasis" : ""}.`;
}
