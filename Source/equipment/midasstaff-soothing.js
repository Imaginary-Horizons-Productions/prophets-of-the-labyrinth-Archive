const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Soothing Midas Staff", "Apply @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} to a combatant", "@{mod1} +@{bonus}", "Water", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "any" })
	.setSidegrades("Accelerating Midas Staff", "Discounted Midas Staff")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Curse of Midas", stacks: 1 }, { name: "Regen", stacks: 2 }])
	.setBonus(1) // Curse of Midas stacks
	.setCost(350)
	.setUses(10);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, curse, regen], bonus } = module.exports;
	const pendingCurse = { ...curse, stacks: curse.stacks + (isCrit ? bonus : 0) };
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	addModifier(target, pendingCurse);
	addModifier(target, regen);
	return `${target.getName(adventure.room.enemyIdMap)} gains Curse of Midas and Regen.`;
}
