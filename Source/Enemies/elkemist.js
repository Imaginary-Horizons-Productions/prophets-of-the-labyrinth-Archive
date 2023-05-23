const Enemy = require("../../Classes/Enemy.js");
const { generateRandomNumber } = require("../../helpers.js");
const { addBlock, dealDamage, addModifier, removeModifier } = require("../combatantDAO.js");
const { selectRandomFoe, selectSelf, selectAllFoes, nextRandom } = require("../enemyDAO.js");
const { isBuff } = require("../Modifiers/_modifierDictionary.js");

module.exports = new Enemy("Elkemist")
	.setFirstAction("random")
	.addAction({ name: "Toil", element: "Untyped", isPriority: false, effect: toilEffect, selector: selectSelf, next: nextRandom })
	.addAction({ name: "Trouble", element: "Water", isPriority: false, effect: troubleEffect, selector: selectRandomFoe, next: nextRandom })
	.addAction({ name: "Boil", element: "Fire", isPriority: false, effect: boilEffect, selector: selectAllFoes, next: nextRandom })
	.addAction({ name: "Bubble", element: "Untyped", isPriority: false, effect: bubbleEffect, selector: selectAllFoes, next: nextRandom })
	.setHp(2000)
	.setSpeed(100)
	.setElement("Water")
	.setStaggerThreshold(4);

function toilEffect(targets, user, isCrit, adventure) {
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

function troubleEffect([target], user, isCrit, adventure) {
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

function boilEffect(targets, user, isCrit, adventure) {
	// Fire damage to all foes
	let damage = 75;
	if (isCrit) {
		damage *= 2;
	}
	return targets.map(target => dealDamage(target, user, damage, false, "Fire", adventure)).join(" ");
}

function bubbleEffect(targets, user, isCrit, adventure) {
	// Remove buffs from all foes and gain progress per removed
	let progressGained = generateRandomNumber(adventure, 16, "battle");
	const affectedDelvers = new Set();
	if (isCrit) {
		progressGained += 10;
	}
	for (const target in targets) {
		for (let modifier in target.modifiers) {
			if (isBuff(modifier)) {
				delete target.modifiers[modifier];
				progressGained += 5;
				if (!affectedDelvers.has(target.name)) {
					affectedDelvers.add(target.name);
				}
			}
		}
	}
	addModifier(user, { name: "Progress", stacks: progressGained });

	if (affectedDelvers.size > 0) {
		return `It cackles as it nullifies buffs on ${[...affectedDelvers].join(", ")}.`;
	} else {
		return "It's disappointed the party has no buffs to nullify.";
	}
}
