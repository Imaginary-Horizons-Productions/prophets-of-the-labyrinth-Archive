const Enemy = require("../../Classes/Enemy.js");
const { dealDamage, addModifier, removeModifier } = require("../combatantDAO.js");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes, spawnEnemy } = require("../enemyDAO.js");

module.exports = new Enemy("Mechabee")
	.setFirstAction("Sting")
	.addAction({ name: "Sting", element: "Earth", isPriority: false, effect: stingEffect, selector: selectRandomFoe, next: mechabeePattern })
	.addAction({ name: "Evade", element: "Untyped", isPriority: false, effect: evadeEffect, selector: selectSelf, next: mechabeePattern })
	.addAction({ name: "Call for Help", element: "Untyped", isPriority: false, effect: summonEffect, selector: selectNone, next: mechabeePattern })
	.addAction({ name: "Self-Destruct", element: "Earth", isPriority: false, effect: selfDestructEffect, selector: selectAllFoes, next: mechabeePattern })
	.setHp(200)
	.setSpeed(100)
	.setElement("Earth")
	.setStaggerThreshold(3);

const PATTERN = {
	"Sting": "Evade",
	"Evade": "Call for Help",
	"Call for Help": "Self-Destruct",
	"Self-Destruct": "Sting"
}
function mechabeePattern(actionName) {
	return PATTERN[actionName]
}

function stingEffect([target], user, isCrit, adventure) {
	addModifier(target, { name: "Stagger", stacks: 1 });
	if (isCrit) {
		addModifier(target, { name: "Poison", stacks: 4 });
	} else {
		addModifier(target, { name: "Poison", stacks: 2 });
	}
	return dealDamage(target, user, 10, false, user.element, adventure);
}

function evadeEffect(targets, user, isCrit, adventure) {
	let stacks = 2;
	if (isCrit) {
		stacks *= 3;
	}
	addModifier(user, { name: "Evade", stacks });
	removeModifier(user, { name: "Stagger", stacks: 1 });
	return "";
}

function summonEffect(targets, user, isCrit, adventure) {
	spawnEnemy(adventure, module.exports, true);
	return "Another mechabee arrives.";
}

function selfDestructEffect(targets, user, isCrit, adventure) {
	let damage = 125;
	if (isCrit) {
		damage *= 2;
	}
	user.hp = 0;

	return targets.map(target => {
		addModifier(target, { name: "Stagger", stacks: 1 });
		return dealDamage(target, user, damage, false, user.element, adventure);
	}).join(" ");
}
