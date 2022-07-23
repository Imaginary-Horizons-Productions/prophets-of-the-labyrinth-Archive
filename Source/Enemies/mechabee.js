const Enemy = require("../../Classes/Enemy.js");
const { dealDamage, addModifier, removeModifier } = require("../combatantDAO.js");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes, spawnEnemy } = require("../enemyDAO.js");

module.exports = new Enemy("Mechabee")
	.setFirstAction("Sting")
	.addAction({ name: "Sting", isPriority: false, effect: stingEffect, selector: selectRandomFoe, next: mechabeePattern })
	.addAction({ name: "Evade", isPriority: false, effect: evadeEffect, selector: selectSelf, next: mechabeePattern })
	.addAction({ name: "Call for Help", isPriority: false, effect: summonEffect, selector: selectNone, next: mechabeePattern })
	.addAction({ name: "Self-Destruct", isPriority: false, effect: selfDestructEffect, selector: selectAllFoes, next: mechabeePattern })
	.setBounty(25)
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

function stingEffect(target, user, isCrit, adventure) {
	addModifier(target, { name: "Stagger", stacks: 1 });
	if (isCrit) {
		addModifier(target, { name: "Poison", stacks: 4 });
	} else {
		addModifier(target, { name: "Poison", stacks: 2 });
	}
	return dealDamage(target, user, 10, false, user.element, adventure);
}

function evadeEffect(target, user, isCrit, adventure) {
	let stacks = 2;
	if (isCrit) {
		stacks *= 3;
	}
	addModifier(user, { name: "Evade", stacks });
	removeModifier(user, { name: "Stagger", stacks: 1 });
	return "";
}

function summonEffect(target, user, isCrit, adventure) {
	spawnEnemy(adventure, module.exports, true);
	return "Another mechabee arrives.";
}

function selfDestructEffect(target, user, isCrit, adventure) {
	let damage = 125;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	user.hp = 0;
	return dealDamage(target, user, damage, false, user.element, adventure);
}
