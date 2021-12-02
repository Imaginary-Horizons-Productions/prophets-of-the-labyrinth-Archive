const Enemy = require("../../Classes/Enemy.js");
const { addBlock, addModifier, removeModifier, dealDamage } = require("../combatantDAO.js");
const { selectRandomFoe, selectSelf, nextRandom } = require("../enemyDAO.js");

module.exports = new Enemy("Geode Tortoise")
	.setHp(350)
	.setSpeed(85)
	.setElement("Earth")
	.setStaggerThreshold(5)
	.setFirstAction("random")
	.addAction({ name: "Bite", effect: biteEffect, selector: selectRandomFoe, next: nextRandom })
	.addAction({ name: "Crystallize", effect: crystallizeEffect, selector: selectSelf, next: nextRandom });

function biteEffect(target, user, isCrit, adventure) {
	let damage = 50;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, "Stagger", 1);
	return dealDamage(target, user, damage, user.element, adventure);
}

function crystallizeEffect(target, user, isCrit, adventure) {
	addBlock(user, 150);
	if (isCrit) {
		addModifier(user, "powerup", 50);
		removeModifier(user, "Stagger", 1);
	} else {
		addModifier(user, "powerup", 25);
	}
	return "";
}
