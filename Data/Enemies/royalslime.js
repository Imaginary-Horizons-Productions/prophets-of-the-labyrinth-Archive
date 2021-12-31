const DamageType = require("../../Classes/DamageType.js");
const Enemy = require("../../Classes/Enemy.js");
const { generateRandomNumber } = require("../../helpers.js");
const { addModifier, getFullName, dealDamage } = require("../combatantDAO.js");
const { selectRandomFoe, nextRandom, selectSelf } = require("../enemyDAO.js");

module.exports = new Enemy("Royal Slime")
	.setHp(200)
	.setSpeed(90)
	.setElement("@{adventure}")
	.setStaggerThreshold(5)
	.setFirstAction("Element Shift")
	.addAction({ name: "Element Shift", effect: tackleEffect, selector: selectSelf, next: nextRandom })
	.addAction({ name: "Tackle", effect: tackleEffect, selector: selectRandomFoe, next: nextRandom })
	.addAction({ name: "Goop Spray", effect: goopSprayEffect, selector: selectRandomFoe, next: nextRandom })
	.setBounty(25);

function elementShift(target, user, isCrit, adventure) {
	user.element = DamageType.elementsList()[generateRandomNumber(adventure, DamageType.elementsList().length)];
	return "";
}

function tackleEffect(target, user, isCrit, adventure) {
	let damage = 25;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, "Stagger", 1);
	return dealDamage(target, user, damage, adventure.element, adventure);
}

function goopSprayEffect(target, user, isCrit, adventure) {
	if (isCrit) {
		addModifier(target, "Slow", 3);
		addModifier(target, "Stagger", 1);
	} else {
		addModifier(target, "Slow", 2);
	}
	return `${getFullName(target, adventure.room.enemyTitles)} is Slowed by the sticky ooze.`;
}
