const Enemy = require("../../Classes/Enemy.js");
const { dealDamage, addModifier, removeModifier } = require("../combatantDAO.js");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes, spawnEnemy } = require("../enemyDAO.js");

module.exports = new Enemy("Mechabee")
	.setHp(200)
	.setSpeed(100)
	.setElement("Darkness")
	.setStaggerThreshold(3)
	.setFirstAction("Sting")
	.addAction({ name: "Sting", effect: stingEffect, selector: selectRandomFoe, next: mechabeePattern })
	.addAction({ name: "Evade", effect: evadeEffect, selector: selectSelf, next: mechabeePattern })
	.addAction({ name: "Call for Help", effect: summonEffect, selector: selectNone, next: mechabeePattern })
	.addAction({ name: "Self-Destruct", effect: selfDestructEffect, selector: selectAllFoes, next: mechabeePattern })
	.setBounty(25);

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
	return dealDamage(target, user, 10, user.element, adventure);
}

function evadeEffect(target, user, isCrit, adventure) {
	let stacks = 1;
	if (isCrit) {
		stacks *= 2;
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
	return dealDamage(target, user, damage, user.element, adventure);
}
