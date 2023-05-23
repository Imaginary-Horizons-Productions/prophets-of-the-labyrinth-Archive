const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Charging War Cry", "*Inflict @{mod1Stacks} @{mod1} on a foe and all foes with Exposed then gain @{mod3Stacks} @{mod3}*\nCritical Hit💥: Inflict @{mod2Stacks} @{mod2} instead", "Fire", effect, ["Tormenting War Cry"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 2 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.markPriority();

function effect([initialTarget], user, isCrit, adventure) {
	const targetSet = new Set(getFullName(initialTarget, adventure.room.enemyTitles));
	const targetArray = [initialTarget];
	adventure.room.enemies.forEach(enemy => {
		if (enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(getFullName(enemy, adventure.room.enemyTitles))) {
			targetSet.add(getFullName(enemy, adventure.room.enemyTitles));
			targetArray.push(enemy);
		}
	})

	let { element, modifiers: [elementStagger, stagger, critStagger, powerup] } = module.exports;
	let staggerStacks = 0;
	if (user.element === element) {
		staggerStacks += elementStagger.stacks;
	}
	if (isCrit) {
		staggerStacks += critStagger.stacks;
	} else {
		staggerStacks += stagger.stacks;
	}
	targetArray.forEach(target => {
		addModifier(target, { name: "Stagger", stacks: staggerStacks });
	});
	addModifier(user, powerup);
	return `${Array(targetSet).join(", ")} ${targetArray.length === 1 ? "is" : "are"} staggered by the fierce war cry.`;
}
