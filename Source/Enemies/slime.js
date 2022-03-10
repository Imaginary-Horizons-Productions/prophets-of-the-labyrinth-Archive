const Enemy = require("../../Classes/Enemy.js");

// import from modules that depend on /Config
let selectRandomFoe, nextRandom, addModifier, getFullName, dealDamage;
module.exports.injectConfig = function (isProduction) {
	({ selectRandomFoe, nextRandom } = require("../enemyDAO.js").injectConfig(isProduction));
	({ addModifier, getFullName, dealDamage } = require("../combatantDAO.js").injectConfig(isProduction));
	return new Enemy("@{adventure} Slime")
		.setHp(200)
		.setSpeed(90)
		.setElement("@{adventure}")
		.setStaggerThreshold(5)
		.setFirstAction("Tackle")
		.addAction({ name: "Tackle", effect: tackleEffect, selector: selectRandomFoe, next: nextRandom })
		.addAction({ name: "Goop Spray", effect: goopSprayEffect, selector: selectRandomFoe, next: nextRandom })
		.setBounty(25);
}

function tackleEffect(target, user, isCrit, adventure) {
	let damage = 25;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	return dealDamage(target, user, damage, false, adventure.element, adventure);
}

function goopSprayEffect(target, user, isCrit, adventure) {
	if (isCrit) {
		addModifier(target, { name: "Slow", stacks: 3 });
		addModifier(target, { name: "Stagger", stacks: 1 });
	} else {
		addModifier(target, { name: "Slow", stacks: 2 });
	}
	return `${getFullName(target, adventure.room.enemyTitles)} is Slowed by the sticky ooze.`;
}
