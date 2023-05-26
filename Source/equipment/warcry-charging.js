const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Charging War Cry", "Inflict @{mod1Stacks} @{mod1} on a foe and all foes with Exposed then gain @{mod2Stacks} @{mod2}", "@{mod1} +@{bonus}", "Fire", effect, ["Slowing War Cry", "Tormenting War Cry"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setBonus(1) // Stagger stacks
	.setCost(350)
	.setUses(10)
	.markPriority();

function effect([initialTarget], user, isCrit, adventure) {
	const targetSet = new Set().add(getFullName(initialTarget, adventure.room.enemyTitles));
	const targetArray = [initialTarget];
	adventure.room.enemies.forEach(enemy => {
		if (enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(getFullName(enemy, adventure.room.enemyTitles))) {
			targetSet.add(getFullName(enemy, adventure.room.enemyTitles));
			targetArray.push(enemy);
		}
	})

	let { element, modifiers: [elementStagger, stagger, powerup], bonus } = module.exports;
	let pendingStaggerStacks = stagger.stacks;
	if (user.element === element) {
		pendingStaggerStacks += elementStagger.stacks;
	}
	if (isCrit) {
		pendingStaggerStacks += bonus;
	}
	targetArray.forEach(target => {
		addModifier(target, { name: "Stagger", stacks: pendingStaggerStacks });
	});
	addModifier(user, powerup);
	return `${[...targetSet].join(", ")} ${targetArray.length === 1 ? "is" : "are"} staggered by the fierce war cry.`;
}
