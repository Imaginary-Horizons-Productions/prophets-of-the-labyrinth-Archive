const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Slowing War Cry", "Inflict @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} on a foe and all foes with Exposed", "@{mod1} +@{bonus}", "Fire", effect, ["Charging War Cry", "Tormenting War Cry"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }], { name: "Slow", stacks: 1 })
	.setBonus(1) // Stagger stacks
	.setCost(200)
	.setUses(10)
	.markPriority();

function effect([initialTarget], user, isCrit, adventure) {
	const targetSet = new Set().add(initialTarget.getName(adventure.room.enemyIdMap));
	const targetArray = [initialTarget];
	adventure.room.enemies.forEach(enemy => {
		if (enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(enemy.getName(adventure.room.enemyIdMap))) {
			targetSet.add(enemy.getName(adventure.room.enemyIdMap));
			targetArray.push(enemy);
		}
	})

	let { element, modifiers: [elementStagger, stagger, slow], bonus } = module.exports;
	let pendingStaggerStacks = stagger.stacks;
	if (user.element === element) {
		pendingStaggerStacks += elementStagger.stacks;
	}
	if (isCrit) {
		pendingStaggerStacks += bonus;
	}
	targetArray.forEach(target => {
		addModifier(target, { name: "Stagger", stacks: pendingStaggerStacks });
		addModifier(target, slow);
	})
	return `${[...targetSet].join(", ")} ${targetArray.length === 1 ? "is" : "are"} staggered and Slowed by the fierce war cry.`;
}
