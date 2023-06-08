const Enemy = require("../../Classes/Enemy.js");
const { addModifier, dealDamage } = require("../combatantDAO.js");
const { selectRandomFoe, nextRandom } = require("../enemyDAO.js");

module.exports = new Enemy("@{adventureOpposite} Ooze")
	.setFirstAction("Goop Spray")
	.addAction({ name: "Goop Spray", element: "Untyped", isPriority: false, effect: goopSprayEffect, selector: selectRandomFoe, next: nextRandom })
	.addAction({ name: "Tackle", element: "@{adventureOpposite}", isPriority: false, effect: tackleEffect, selector: selectRandomFoe, next: nextRandom })
	.setHp(200)
	.setSpeed(90)
	.setElement("@{adventureOpposite}")
	.setStaggerThreshold(5);

function tackleEffect([target], user, isCrit, adventure) {
	let damage = 25;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	return dealDamage(target, user, damage, false, user.element, adventure);
}

function goopSprayEffect([target], user, isCrit, adventure) {
	if (isCrit) {
		addModifier(target, { name: "Slow", stacks: 3 });
		addModifier(target, { name: "Stagger", stacks: 1 });
	} else {
		addModifier(target, { name: "Slow", stacks: 2 });
	}
	return `${target.getName(adventure.room.enemyIdMap)} is Slowed by the sticky ooze.`;
}
