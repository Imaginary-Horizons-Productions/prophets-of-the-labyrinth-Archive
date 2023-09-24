const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Iron Fist Stance", "Increase Punch damage by @{bonus} and change its type to yours (exit other stances)", "Gain @{mod2Stacks} @{mod2}", "Wind", effect)
	.setCategory("Technique")
	.setTargetingTags({ target: "self", team: "self" })
	.setUpgrades("Organic Iron Fist Stance")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Iron Fist Stance", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setBonus(45) // Punch damage boost
	.setCost(200)
	.setUses(10);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, ironFistStance, powerUp] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, powerUp);
	}
	removeModifier(user, { name: "Floating Mist Stance", stacks: "all", force: true });
	addModifier(user, ironFistStance);
	return `${user.getName(adventure.room.enemyIdMap)} enters Iron Fist Stance${isCrit ? " and is Powered Up" : ""}.`;
}
