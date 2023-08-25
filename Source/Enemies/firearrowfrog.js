const Enemy = require("../../Classes/Enemy.js");
const { addModifier, removeModifier, dealDamage } = require("../combatantDAO.js");
const { selectRandomFoe, selectSelf } = require("../enemyDAO.js");

module.exports = new Enemy("Fire-Arrow Frog")
	.setFirstAction("random")
	.addAction({ name: "Venom Cannon", element: "Fire", priority: 0, effect: venomCannonEffect, selector: selectRandomFoe, next: firearrowFrogPattern })
	.addAction({ name: "Burrow", element: "Untyped", priority: 0, effect: burrowEffect, selector: selectSelf, next: firearrowFrogPattern })
	.addAction({ name: "Goop Spray", element: "Untyped", priority: 0, effect: goopSprayEffect, selector: selectRandomFoe, next: firearrowFrogPattern })
	.setHp(250)
	.setSpeed(100)
	.setElement("Fire")
	.setStaggerThreshold(2);

const PATTERN = {
	"Venom Cannon": "random",
	"Burrow": "Venom Cannon",
	"Goop Spray": "Venom Cannon"
}
function firearrowFrogPattern(actionName) {
	return PATTERN[actionName]
}

function venomCannonEffect([target], user, isCrit, adventure) {
	let damage = 20;
	if (isCrit) {
		addModifier(target, { name: "Poison", stacks: 6 });
	} else {
		addModifier(target, { name: "Poison", stacks: 3 });
	}
	return dealDamage(target, user, damage, false, user.element, adventure).then(damageText => {
		return `${target.getName(adventure.room.enemyIdMap)} is Poisoned. ${damageText}`;
	});
}

function burrowEffect(targets, user, isCrit, adventure) {
	let stacks = 2;
	if (isCrit) {
		stacks *= 3;
	}
	addModifier(user, { name: "Evade", stacks });
	removeModifier(user, { name: "Stagger", stacks: 1 });
	return "It's prepared to Evade.";
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
