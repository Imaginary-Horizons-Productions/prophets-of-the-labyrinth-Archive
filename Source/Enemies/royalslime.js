const Enemy = require("../../Classes/Enemy.js");
const { generateRandomNumber } = require("../../helpers.js");
const { addModifier, dealDamage, removeModifier } = require("../combatantDAO.js");
const { elementsList } = require("../elementHelpers.js");
const { nextRandom, selectSelf, selectAllFoes, selectRandomFoe } = require("../enemyDAO.js");

module.exports = new Enemy("Royal Slime")
	.setFirstAction("Element Shift")
	.addAction({ name: "Element Shift", isPriority: false, effect: elementShift, selector: selectSelf, next: nextRandom })
	.addAction({ name: "Rolling Tackle", isPriority: false, effect: rollingTackleEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Goop Deluge", isPriority: false, effect: goopDelugeEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Toxic Spike Shot", isPriority: false, effect: toxicSpikeShotEffect, selector: selectRandomFoe, next: nextRandom })
	.setHp(600)
	.setSpeed(90)
	.setElement("@{adventure}")
	.setStaggerThreshold(5);

function elementShift(target, user, isCrit, adventure) {
	user.element = elementsList()[generateRandomNumber(adventure, elementsList().length, "battle")];
	if (isCrit) {
		addModifier(user, { name: `${user.element} Absorb`, stacks: 5 });
		removeModifier(user, { name: "Stagger", stacks: 1 });
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
	return dealDamage(target, user, damage, false, user.element, adventure);
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
	return dealDamage(target, user, damage, false, user.element, adventure);
}
