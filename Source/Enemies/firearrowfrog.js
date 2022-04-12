const Enemy = require("../../Classes/Enemy.js");

let // import from modules that depend on /Config
	// combatantDAO
	addModifier,
	removeModifier,
	getFullName,
	dealDamage,
	// enemyDAO
	selectRandomFoe,
	selectSelf;
module.exports.injectConfig = function (isProduction) {
	({ addModifier, removeModifier, getFullName, dealDamage } = require("../combatantDAO.js").injectConfig(isProduction));
	({ selectRandomFoe, selectSelf } = require("../enemyDAO.js").injectConfig(isProduction));
	return new Enemy("Fire-Arrow Frog")
		.setFirstAction("random")
		.addAction({ name: "Venom Cannon", effect: venomCannonEffect, selector: selectRandomFoe, next: firearrowFrogPattern })
		.addAction({ name: "Evade", effect: evadeEffect, selector: selectSelf, next: firearrowFrogPattern })
		.addAction({ name: "Goop Spray", effect: goopSprayEffect, selector: selectRandomFoe, next: firearrowFrogPattern })
		.setBounty(25)
		.setHp(250)
		.setSpeed(100)
		.setElement("Fire")
		.setStaggerThreshold(2);
}

const PATTERN = {
	"Venom Cannon": "random",
	"Evade": "Venom Cannon",
	"Goop Spray": "Venom Cannon"
}
function firearrowFrogPattern(actionName) {
	return PATTERN[actionName]
}

function venomCannonEffect(target, user, isCrit, adventure) {
	let damage = 20;
	if (isCrit) {
		addModifier(target, { name: "Poison", stacks: 6 });
	} else {
		addModifier(target, { name: "Poison", stacks: 3 });
	}
	return dealDamage(target, user, damage, false, user.element, adventure).then(damageText => {
		return `${getFullName(target, adventure.room.enemyTitles)} is poisoned. ${damageText}`;
	});
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

function goopSprayEffect(target, user, isCrit, adventure) {
	if (isCrit) {
		addModifier(target, { name: "Slow", stacks: 3 });
		addModifier(target, { name: "Stagger", stacks: 1 });
	} else {
		addModifier(target, { name: "Slow", stacks: 2 });
	}
	return `${getFullName(target, adventure.room.enemyTitles)} is Slowed by the sticky ooze.`;
}
