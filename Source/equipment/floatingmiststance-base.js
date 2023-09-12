const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Floating Mist Stance", "Enter a stance that increases Punch stagger by @{bonus} and grants @{mod1Stacks} @{mod1} each round (exit other stances)", "Gain @{mod1Stacks} @{mod1} now", "Wind", effect)
	.setCategory("Technique")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 }])
	.setBonus(2) // Punch stagger boost
	.setCost(200)
	.setUses(10);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, displayEvade, floatingMistStance] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, displayEvade);
	}
	removeModifier(user, { name: "Iron Fist Stance", stacks: "all", force: true });
	addModifier(user, floatingMistStance);
	return `${user.getName(adventure.room.enemyIdMap)} enters Floating Mist Stance${isCrit ? " and prepares to Evade" : ""}.`;
}
