const Enemy = require("../../Classes/Enemy.js");
const { addModifier, addBlock, removeModifier, dealDamage } = require("../combatantDAO.js");
const { selectSelf, selectNone, selectAllFoes, selectRandomFoe } = require("../enemyDAO.js");

module.exports = new Enemy("Treasure Elemental")
	.setHp(99999)
	.setSpeed(100)
	.setElement("Earth")
	.setStaggerThreshold(3)
	.setFirstAction("Guarding Slam")
	.addAction({ name: "Guarding Slam", effect: guardingSlamEffect, selector: selectRandomFoe, next: treasureElementalPattern })
	.addAction({ name: "Evade", effect: evadeEffect, selector: selectSelf, next: treasureElementalPattern })
	.addAction({ name: "Eyes of Greed", effect: eyesOfGreedEffect, selector: selectAllFoes, next: treasureElementalPattern })
	.addAction({ name: "Heavy Pockets", effect: heavyPocketsEffect, selector: selectAllFoes, next: treasureElementalPattern })
	.addAction({ name: "Escape", effect: escapeEffect, selector: selectNone, next: treasureElementalPattern })
	.addStartingModifier("Curse of Midas", 1)
	.setBounty(0);

const PATTERN = {
	"Guarding Slam": "Evade",
	"Evade": "Eyes of Greed",
	"Eyes of Greed": "Heavy Pockets",
	"Heavy Pockets": "Escape",
	"Escape": "Escape"
}
function treasureElementalPattern(actionName) {
	return PATTERN[actionName]
}

function guardingSlamEffect(target, user, isCrit, adventure) {
	let block = 100;
	if (isCrit) {
		block *= 2;
	}
	addBlock(user, block);
	removeModifier(user, { name: "Stagger", stacks: 1 });
	return dealDamage(target, user, 100, user.element, adventure);
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

function eyesOfGreedEffect(target, user, isCrit, adventure) {
	let stacks = 25;
	if (isCrit) {
		stacks *= 2;
	}
	addModifier(target, { name: "Power Down", stacks });
	addModifier(target, { name: "Stagger", stacks: 1 });
	addModifier(user, { name: "Curse of Midas", stacks: 1 });
	return "";
}

function heavyPocketsEffect(target, user, isCrit, adventure) {
	let stacks = 2;
	if (isCrit) {
		stacks *= 2;
	}
	addModifier(target, { name: "Slow", stacks });
	return "";
}

function escapeEffect(target, user, isCrit, adventure) {
	user.hp = 0;
	return "The treasure elemental makes its escape!";
}
