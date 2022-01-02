const DamageType = require("../../Classes/DamageType.js");
const Enemy = require("../../Classes/Enemy.js");
const { generateRandomNumber } = require("../../helpers.js");
const { addModifier, dealDamage, removeModifier } = require("../combatantDAO.js");
const { nextRandom, selectSelf, selectAllFoes, selectRandomFoe } = require("../enemyDAO.js");

module.exports = new Enemy("Royal Slime")
	.setHp(600)
	.setSpeed(90)
	.setElement("@{adventure}")
	.setStaggerThreshold(5)
	.setFirstAction("Element Shift")
	.addAction({ name: "Element Shift", effect: elementShift, selector: selectSelf, next: nextRandom })
	.addAction({ name: "Rolling Tackle", effect: rollingTackleEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Goop Deluge", effect: goopDelugeEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Toxic Spike Shot", effect: toxicSpikeShotEffect, selector: selectRandomFoe, next: nextRandom })
	.setBounty(100);

function elementShift(target, user, isCrit, adventure) {
	user.element = DamageType.elementsList()[generateRandomNumber(adventure, DamageType.elementsList().length, "battle")];
	if (isCrit) {
		addModifier(user, { name: `${user.element} Absorb`, stacks: 5 });
		removeModifier(user, "Stagger", 1);
	} else {
		addModifier(user, { name: `${user.element} Absorb`, stacks: 3 });
	}
	return "";
}

function rollingTackleEffect(target, user, isCrit, adventure) {
	let damage = 75;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	return dealDamage(target, user, damage, user.element, adventure);
}

function goopDelugeEffect(target, user, isCrit, adventure) {
	if (isCrit) {
		addModifier(target, { name: "Slow", stacks: 3 });
		addModifier(target, { name: "Stagger", stacks: 1 });
	} else {
		addModifier(target, { name: "Slow", stacks: 2 });
	}
	return "";
}

function toxicSpikeShotEffect(target, user, isCrit, adventure) {
	let damage = 25;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	addModifier(target, { name: "Poison", stacks: 2 });
	return dealDamage(target, user, damage, user.element, adventure);
}
