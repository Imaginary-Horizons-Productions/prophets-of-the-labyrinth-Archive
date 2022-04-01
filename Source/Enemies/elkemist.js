const Enemy = require("../../Classes/Enemy.js");

// import from modules that depend on /Config
let
	// helpers
	generateRandomNumber,
	// enemyDAO
	selectRandomFoe,
	selectSelf,
	selectAllFoes,
	nextRandom,
	// combatantDAO
	addBlock,
	dealDamage,
	addModifier,
	removeModifier,
	// modifierDictionary
	isBuff;
module.exports.injectConfig = function (isProduction) {
	({ generateRandomNumber } = require("../../helpers.js").injectConfig(isProduction));
	({ selectRandomFoe, selectSelf, selectAllFoes, nextRandom } = require("../enemyDAO.js").injectConfig(isProduction));
	({ addBlock, dealDamage, addModifier, removeModifier } = require("../combatantDAO.js").injectConfig(isProduction));
	({ isBuff } = require("../Modifiers/_modifierDictionary.js").injectConfig(isProduction));
	return new Enemy("Elkemist")
		.setHp(2000)
		.setSpeed(100)
		.setElement("Water")
		.setStaggerThreshold(4)
		.setFirstAction("Toil")
		.addAction({ name: "Toil", effect: toilEffect, selector: selectSelf, next: nextRandom })
		.addAction({ name: "Trouble", effect: troubleEffect, selector: selectRandomFoe, next: nextRandom })
		.addAction({ name: "Boil", effect: boilEffect, selector: selectAllFoes, next: nextRandom })
		.addAction({ name: "Bubble", effect: bubbleEffect, selector: selectAllFoes, next: nextRandom })
		.setBounty(0);
}

function toilEffect(target, user, isCrit, adventure) {
	// Gain block and medium progress
	removeModifier(user, { name: "Stagger", stacks: 1 });
	if (isCrit) {
		addModifier(user, { name: "Progress", stacks: 20 + generateRandomNumber(adventure, 16, "battle") });
	} else {
		addModifier(user, { name: "Progress", stacks: 15 + generateRandomNumber(adventure, 11, "battle") });
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
		addModifier(user, { name: "Progress", stacks: 10 + generateRandomNumber(adventure, 6, "battle") });
	} else {
		addModifier(user, { name: "Progress", stacks: 5 + generateRandomNumber(adventure, 6, "battle") });
	}
	for (let modifier in target.modifiers) {
		if (isBuff(modifier)) {
			delete target.modifiers[modifier];
		}
	}
	return `The Elkemist cackles as ${target}'s buffs are nullified.`;
}