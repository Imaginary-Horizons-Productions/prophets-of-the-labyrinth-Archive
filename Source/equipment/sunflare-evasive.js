const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Evasive Sun Flare", "Inflict @{mod1Stacks} @{mod1} on a foe and gain @{mod2Stacks} @{mod2} with priority", "Also inflict @{mod3Stacks} @{mod3}", "Wind", effect)
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Accelerating Sun Flare", "Tormenting Sun Flare")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Slow", stacks: 2 }])
	.setCost(350)
	.setUses(15)
	.setPriority(1)
	.setBlock(50);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, stagger, evade, slow] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	addModifier(target, stagger);
	addModifier(user, evade);
	return `${user.getName(adventure.room.enemyIdMap)} prepares to Evade.${isCrit ? ` ${target.getName(adventure.room.enemyIdMap)} is Slowed.` : ""}`;
}
