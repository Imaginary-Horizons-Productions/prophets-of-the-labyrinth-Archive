const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Sun Flare", "Inflict @{mod1Stacks} @{mod1} on a foe with priority", "Also inflict @{mod2Stacks} @{mod2}", "Wind", needsLivingTargets(effect))
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Accelerating Sun Flare", "Evasive Sun Flare", "Tormenting Sun Flare")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setCost(200)
	.setUses(15)
	.setPriority(1);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, stagger, slow] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
		addModifier(target, stagger);
		return `${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
	} else {
		addModifier(target, stagger);
		return "";
	}
}
