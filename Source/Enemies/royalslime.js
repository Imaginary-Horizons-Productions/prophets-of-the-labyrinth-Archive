const Enemy = require("../../Classes/Enemy.js");
const { generateRandomNumber } = require("../../helpers.js");
const { addModifier, dealDamage, removeModifier } = require("../combatantDAO.js");
const { elementsList } = require("../elementHelpers.js");
const { nextRandom, selectSelf, selectAllFoes, selectRandomFoe } = require("../enemyDAO.js");

module.exports = new Enemy("Royal Slime")
	.setFirstAction("Element Shift")
	.addAction({ name: "Element Shift", element: "Untyped", isPriority: false, effect: elementShift, selector: selectSelf, next: nextRandom })
	.addAction({ name: "Rolling Tackle", element: "@{adventure}", isPriority: false, effect: rollingTackleEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Goop Deluge", element: "Untyped", isPriority: false, effect: goopDelugeEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Toxic Spike Shot", element: "@{adventure}", isPriority: false, effect: toxicSpikeShotEffect, selector: selectRandomFoe, next: nextRandom })
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
	return "";
}

function rollingTackleEffect(targets, user, isCrit, adventure) {
	let damage = 75;
	if (isCrit) {
		damage *= 2;
	}
	return Promise.all(
		targets.map(target => {
			addModifier(target, { name: "Stagger", stacks: 1 });
			return dealDamage(target, user, damage, false, user.element, adventure);
		})
	).then(results => results.join(" "));
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
	return "";
}

function toxicSpikeShotEffect([target], user, isCrit, adventure) {
	let damage = 25;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	addModifier(target, { name: "Poison", stacks: 2 });
	return dealDamage(target, user, damage, false, user.element, adventure);
}
