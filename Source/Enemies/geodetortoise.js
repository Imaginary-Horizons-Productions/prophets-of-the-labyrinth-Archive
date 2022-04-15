const Enemy = require("../../Classes/Enemy.js");

// import from modules that depend on /Config
let selectRandomFoe, selectSelf, nextRandom, addBlock, addModifier, removeModifier, dealDamage;
module.exports.injectConfig = function (isProduction) {
	({ selectRandomFoe, selectSelf, nextRandom } = require("../enemyDAO.js").injectConfig(isProduction));
	({ addBlock, addModifier, removeModifier, dealDamage } = require("../combatantDAO.js").injectConfig(isProduction));

	return new Enemy("Geode Tortoise")
		.setFirstAction("random")
		.addAction({ name: "Bite", effect: biteEffect, selector: selectRandomFoe, next: nextRandom })
		.addAction({ name: "Crystallize", effect: crystallizeEffect, selector: selectSelf, next: nextRandom })
		.setBounty(40)
		.setHp(350)
		.setSpeed(85)
		.setElement("Earth")
		.setStaggerThreshold(5);
}

function biteEffect(target, user, isCrit, adventure) {
	let damage = 50;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	return dealDamage(target, user, damage, false, user.element, adventure);
}

function crystallizeEffect(target, user, isCrit, adventure) {
	addBlock(user, 150);
	if (isCrit) {
		addModifier(user, { name: "Power Up", stacks: 50 });
		removeModifier(user, { name: "Stagger", stacks: 1 });
	} else {
		addModifier(user, { name: "Power Up", stacks: 25 });
	}
	return "";
}
