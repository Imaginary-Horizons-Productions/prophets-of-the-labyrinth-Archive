const Enemy = require("../../Classes/Enemy.js");
const { addModifier, dealDamage } = require("../combatantDAO.js");
const { selectRandomFoe, nextRandom } = require("../enemyDAO.js");

module.exports = new Enemy("@{adventure} Slime")
	.setFirstAction("Tackle")
	.addAction({ name: "Tackle", element: "@{adventure}", isPriority: false, effect: tackleEffect, selector: selectRandomFoe, next: nextRandom })
	.addAction({ name: "Goop Spray", element: "Untyped", isPriority: false, effect: goopSprayEffect, selector: selectRandomFoe, next: nextRandom })
	.setHp(200)
	.setSpeed(90)
	.setElement("@{adventure}")
	.setStaggerThreshold(5);

function tackleEffect([target], user, isCrit, adventure) {
	let damage = 25;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	return dealDamage(target, user, damage, false, adventure.element, adventure);
}

function goopSprayEffect([target], user, isCrit, adventure) {
	if (isCrit) {
		addModifier(target, { name: "Slow", stacks: 3 });
		addModifier(target, { name: "Stagger", stacks: 1 });
	} else {
		addModifier(target, { name: "Slow", stacks: 2 });
	}
	return `${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
}
