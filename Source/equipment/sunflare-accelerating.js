const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Accelerating Sun Flare", "Inflict @{mod1Stacks} @{mod1} on a foe, then gain @{mod2Stacks} @{mod2} with priority", "Also inflict @{mod3Stacks} @{mod3}", "Wind", needsLivingTargets(effect))
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Evasive Sun Flare", "Tormenting Sun Flare")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Quicken", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setCost(350)
	.setUses(15)
	.setPriority(1);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, stagger, quicken, slow] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	addModifier(target, stagger);
	addModifier(user, quicken);
	return `${user.getName(adventure.room.enemyIdMap)} is Quickened.${isCrit ? `${target.getName(adventure.room.enemyIdMap)} is Slowed.` : ""}`;
}
