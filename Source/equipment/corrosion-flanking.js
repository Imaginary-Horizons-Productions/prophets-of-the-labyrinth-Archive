const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Flanking Corrosion", "Inflict @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} on a foe", "Also inflict @{mod3Stacks} @{mod3}", "Fire", needsLivingTargets(effect))
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Down", stacks: 40 }, { name: "Exposed", stacks: 2 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(15);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerDown, exposed, critStagger] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critStagger);
	}
	addModifier(target, powerDown);
	addModifier(target, exposed);
	return `${target.getName(adventure.room.enemyIdMap)} is Powered Down and Exposed.`;
}
