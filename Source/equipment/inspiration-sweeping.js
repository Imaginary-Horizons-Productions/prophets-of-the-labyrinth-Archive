const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Sweeping Inspiration", "Apply @{mod1Stacks} @{mod1} to all allies", "@{mod1} +@{bonus}", "Wind", needsLivingTargets(effect))
	.setCategory("Spell")
	.setTargetingTags({ target: "all", team: "delver" })
	.setSidegrades("Reinforcing Inspiration", "Soothing Inspiration")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setBonus(25) // Power Up stacks
	.setCost(200)
	.setUses(10);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, powerUp], bonus } = module.exports;
	const pendingPowerUp = { ...powerUp, stacks: powerUp.stacks + (isCrit ? bonus : 0) };
	targets.forEach(target => {
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		addModifier(target, pendingPowerUp);
	})
	return `Everyone is Powered Up.`;
}
