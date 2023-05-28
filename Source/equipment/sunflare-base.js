const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Sun Flare", "Inflict @{mod1Stacks} @{mod1} on a foe with priority", "Also inflict @{mod2Stacks} @{mod2}", "Wind", effect, ["Accelerating Sun Flare", "Evasive Sun Flare", "Tormenting Sun Flare"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setCost(200)
	.setUses(10)
	.markPriority();

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, stagger, slow] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	addModifier(target, stagger);
	return "";
}
