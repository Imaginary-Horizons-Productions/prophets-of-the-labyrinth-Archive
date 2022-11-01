const Enemy = require("../../Classes/Enemy.js");
const { generateRandomNumber } = require("../../helpers.js");
const { addBlock, dealDamage, addModifier, removeModifier } = require("../combatantDAO.js");
const { selectRandomFoe, selectSelf, selectAllFoes, nextRandom } = require("../enemyDAO.js");
const { isBuff } = require("../Modifiers/_modifierDictionary.js");

module.exports = new Enemy("Elkemist")
	.setFirstAction("random")
	.addAction({ name: "Toil", isPriority: false, effect: toilEffect, selector: selectSelf, next: nextRandom })
	.addAction({ name: "Trouble", isPriority: false, effect: troubleEffect, selector: selectRandomFoe, next: nextRandom })
	.addAction({ name: "Boil", isPriority: false, effect: boilEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Bubble", isPriority: false, effect: bubbleEffect, selector: selectAllFoes, next: nextRandom })
	.setHp(2000)
	.setSpeed(100)
	.setElement("Water")
	.setStaggerThreshold(4);

function toilEffect(target, user, isCrit, adventure) {
	// Gain block and medium progress
	removeModifier(user, { name: "Stagger", stacks: 1 });
	if (isCrit) {
		addModifier(user, { name: "Progress", stacks: 60 + generateRandomNumber(adventure, 46, "battle") });
	} else {
		addModifier(user, { name: "Progress", stacks: 45 + generateRandomNumber(adventure, 31, "battle") });
	}
	addBlock(user, 200);
	return "It succeeds at gathering some materials and fortifying its laboratory.";
}

function troubleEffect(target, user, isCrit, adventure) {
	// Damage a single foe and small progress
	let damage = 75 + (user.modifiers["Power Up"] || 0);
	if (isCrit) {
		damage *= 2;
	}
	addModifier(user, { name: "Progress", stacks: 15 + generateRandomNumber(adventure, 16, "battle") });
	addModifier(target, { name: "Stagger", stacks: 1 });
	return dealDamage(target, user, damage, false, user.element, adventure).then(damageText => {
		return `An obstacle to potion progress is identified and mitigated; ${damageText}`;
	})
}

function boilEffect(target, user, isCrit, adventure) {
	// Fire damage to all foes
	let damage = 75;
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, user, damage, false, "Fire", adventure);
}

function bubbleEffect(target, user, isCrit, adventure) {
	// Remove buffs from all foes and big progress
	if (isCrit) {
		addModifier(user, { name: "Progress", stacks: 30 + generateRandomNumber(adventure, 16, "battle") });
	} else {
		addModifier(user, { name: "Progress", stacks: 15 + generateRandomNumber(adventure, 16, "battle") });
	}
	for (let modifier in target.modifiers) {
		if (isBuff(modifier)) {
			delete target.modifiers[modifier];
		}
	}
	return `The Elkemist cackles as ${target.name}'s buffs are nullified.`;
}
