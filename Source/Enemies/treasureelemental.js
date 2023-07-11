const Enemy = require("../../Classes/Enemy.js");
const { addModifier, addBlock, removeModifier, dealDamage } = require("../combatantDAO.js");
const { selectSelf, selectNone, selectAllFoes, selectRandomFoe } = require("../enemyDAO.js");

module.exports = new Enemy("Treasure Elemental")
	.setFirstAction("Guarding Slam")
	.addAction({ name: "Guarding Slam", element: "Earth", isPriority: false, effect: guardingSlamEffect, selector: selectRandomFoe, next: treasureElementalPattern })
	.addAction({ name: "Burrow", element: "Untyped", isPriority: false, effect: burrowEffect, selector: selectSelf, next: treasureElementalPattern })
	.addAction({ name: "Eyes of Greed", element: "Untyped", isPriority: false, effect: eyesOfGreedEffect, selector: selectAllFoes, next: treasureElementalPattern })
	.addAction({ name: "Heavy Pockets", element: "Untyped", isPriority: false, effect: heavyPocketsEffect, selector: selectAllFoes, next: treasureElementalPattern })
	.addAction({ name: "Escape", element: "Untyped", isPriority: false, effect: escapeEffect, selector: selectNone, next: treasureElementalPattern })
	.addStartingModifier("Curse of Midas", 1)
	.setHp(99999)
	.setSpeed(100)
	.setElement("Earth")
	.setStaggerThreshold(3)
	.markAsBoss();

const PATTERN = {
	"Guarding Slam": "Burrow",
	"Burrow": "Eyes of Greed",
	"Eyes of Greed": "Heavy Pockets",
	"Heavy Pockets": "Escape",
	"Escape": "Escape"
}
function treasureElementalPattern(actionName) {
	return PATTERN[actionName]
}

function guardingSlamEffect([target], user, isCrit, adventure) {
	let block = 100;
	if (isCrit) {
		block *= 2;
	}
	addBlock(user, block);
	removeModifier(user, { name: "Stagger", stacks: 1 });
	return dealDamage(target, user, 100, false, user.element, adventure).then(damageText => {
		return `It prepares to Block and ${damageText}`;
	});
}

function burrowEffect(target, user, isCrit, adventure) {
	let stacks = 2;
	if (isCrit) {
		stacks *= 3;
	}
	addModifier(user, { name: "Evade", stacks });
	removeModifier(user, { name: "Stagger", stacks: 1 });
	return "It scatters among the other treasure in the room to Evade.";
}

function eyesOfGreedEffect(targets, user, isCrit, adventure) {
	let stacks = 25;
	if (isCrit) {
		stacks *= 2;
	}
	addModifier(user, { name: "Curse of Midas", stacks: 1 });
	targets.forEach(target => {
		addModifier(target, { name: "Power Down", stacks });
		addModifier(target, { name: "Stagger", stacks: 1 });
	});
	return "Everyone is Powered Down, due to being distracted by a treasure that catches their eyes.";
}

function heavyPocketsEffect(targets, user, isCrit, adventure) {
	let stacks = 2;
	if (isCrit) {
		stacks *= 2;
	}
	targets.forEach(target => {
		addModifier(target, { name: "Slow", stacks });
	});
	return "Everyone is Slowed trying to grab at some treasure.";
}

function escapeEffect(targets, user, isCrit, adventure) {
	user.hp = 0;
	return "The treasure elemental makes its escape!";
}
