const Enemy = require("../../Classes/Enemy.js");
const { generateRandomNumber } = require("../../helpers.js");
const { addModifier, dealDamage, removeModifier } = require("../combatantDAO.js");
const { elementsList } = require("../elementHelpers.js");
const { nextRandom, selectSelf, selectAllFoes, selectRandomFoe } = require("../enemyDAO.js");

module.exports = new Enemy("Royal Slime")
	.setFirstAction("Element Shift")
	.addAction({ name: "Element Shift", element: "Untyped", priority: 0, effect: elementShift, selector: selectSelf, next: nextRandom })
	.addAction({ name: "Rolling Tackle", element: "@{adventure}", priority: 0, effect: rollingTackleEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Goop Deluge", element: "Untyped", priority: 0, effect: goopDelugeEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Toxic Spike Shot", element: "@{adventure}", priority: 0, effect: toxicSpikeShotEffect, selector: selectRandomFoe, next: nextRandom })
	.setHp(600)
	.setSpeed(90)
	.setElement("@{adventure}")
	.setStaggerThreshold(5)
	.markAsBoss();

function elementShift(targets, user, isCrit, adventure) {
	user.element = elementsList()[generateRandomNumber(adventure, elementsList().length, "battle")];
	if (isCrit) {
		addModifier(user, { name: `${user.element} Absorb`, stacks: 5 });
		removeModifier(user, { name: "Stagger", stacks: 1 });
	} else {
		addModifier(user, { name: `${user.element} Absorb`, stacks: 3 });
	}
	return "Its elemental alignment has changed.";
}

function rollingTackleEffect(targets, user, isCrit, adventure) {
	let damage = 75;
	if (isCrit) {
		damage *= 2;
	}
	targets.map(target => {
		addModifier(target, { name: "Stagger", stacks: 1 });
	})
	return dealDamage(targets, user, damage, false, user.element, adventure);
}

function goopDelugeEffect(targets, user, isCrit, adventure) {
	targets.forEach(target => {
		if (isCrit) {
			addModifier(target, { name: "Slow", stacks: 3 });
			addModifier(target, { name: "Stagger", stacks: 1 });
		} else {
			addModifier(target, { name: "Slow", stacks: 2 });
		}
	});
	return "Everyone is Slowed by the sticky ooze.";
}

function toxicSpikeShotEffect([target], user, isCrit, adventure) {
	let damage = 25;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	addModifier(target, { name: "Poison", stacks: 2 });
	return dealDamage([target], user, damage, false, user.element, adventure).then(damageText => {
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
	});
}
