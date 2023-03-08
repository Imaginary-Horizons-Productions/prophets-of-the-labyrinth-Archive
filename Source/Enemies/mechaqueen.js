const Enemy = require("../../Classes/Enemy.js");
const { addBlock, addModifier } = require("../combatantDAO.js");
const { selectRandomFoe, selectNone, selectAllFoes, selectRandomOtherAlly, spawnEnemy } = require("../enemyDAO.js");

const mechabee = require("./mechabee.js")

module.exports = new Enemy("Mecha Queen")
	.setFirstAction("a random protocol")
	.addAction({ name: "Swarm Protocol", isPriority: true, effect: swarmEffect, selector: selectNone, next: mechaQueenPattern })
	.addAction({ name: "Assault Protocol", isPriority: true, effect: assaultEffect, selector: selectRandomFoe, next: mechaQueenPattern })
	.addAction({ name: "Sacrifice Protocol", isPriority: true, effect: sacrificeEffect, selector: selectRandomOtherAlly, next: mechaQueenPattern })
	.addAction({ name: "Deploy Drone", isPriority: false, effect: deployEffect, selector: selectNone, next: mechaQueenPattern })
	.addAction({ name: "V.E.N.O.Missile", isPriority: false, effect: missileEffect, selector: selectRandomFoe, next: mechaQueenPattern })
	.setHp(500)
	.setSpeed(100)
	.setElement("Earth")
	.setStaggerThreshold(4);

const PATTERN = {
	"Swarm Protocol": "V.E.N.O.Missile",
	"Assault Protocol": "V.E.N.O.Missile",
	"Sacrifice Protocol": "V.E.N.O.Missile",
	"Deploy Drone": "a random protocol",
	"V.E.N.O.Missile": "Deploy Drone"
}
function mechaQueenPattern(actionName) {
	return PATTERN[actionName]
}

function missileEffect(target, user, isCrit, adventure) {
	addModifier(target, { name: "Stagger", stacks: 1 });
	if (isCrit) {
		addModifier(target, { name: "Poison", stacks: 5 });
	} else {
		addModifier(target, { name: "Poison", stacks: 3 });
	}
	return "";
}

function deployEffect(target, user, isCrit, adventure) {
	spawnEnemy(adventure, mechabee, true);
	return "Another mechabee arrives.";
}

// assumes mecha queen is at enemy index 0 and that all other enemies are mechabees
function swarmEffect(target, user, isCrit, adventure) {
	adventure.room.moves.forEach(move => {
		if (move.userTeam === "enemy" && move.userIndex !== 0) {
			move.name = "Call for Help";
			move.targets = [{ team: "none", index: "none" }];
		}
	});
	addBlock(user, isCrit ? 200 : 100);
	return "She braces herself and demands reinforcements!";
}

// assumes mecha queen is at enemy index 0 and that all other enemies are mechabees
function assaultEffect(target, user, isCrit, adventure) {
	const { targets } = adventure.room.priorityMoves.find(move => move.userTeam === "enemy" && move.userIndex === 0)
	adventure.room.moves.forEach(move => {
		if (move.userTeam === "enemy" && move.userIndex !== 0) {
			move.name = "Sting";
			move.targets = targets;
		}
	});
	addBlock(user, isCrit ? 200 : 100);
	return "She braces herself and orders a full-on attack!";
}

function sacrificeEffect(target, user, isCrit, adventure) {
	addBlock(user, isCrit ? 200 : 100);
	if (target) {
		const targetMove = adventure.room.moves.find(move => move.userTeam === "enemy" && move.userIndex === parseInt(target.title));
		targetMove.name = "Self-Destruct";
		targetMove.targets = selectAllFoes(adventure, target);
		return "She braces herself and employs desperate measures!";
	}
	return "She braces herself."

}
