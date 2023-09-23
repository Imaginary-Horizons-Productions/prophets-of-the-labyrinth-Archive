const { CombatantReference } = require("../Classes/Adventure.js");
const Enemy = require("../Classes/Enemy.js");
const { generateRandomNumber } = require("../helpers.js");
const { getOpposite } = require("./elementHelpers.js");

module.exports.spawnEnemy = function (adventure, enemyTemplate) {
	/** @type {Enemy} */
	const enemy = Object.assign(new Enemy(), enemyTemplate);
	enemy.modifiers = { ...enemyTemplate.startingModifiers }; // breaks shared reference to modifiers object by enemies of same name
	let hpPercent = 85 + 15 * adventure.delvers.length;
	if (enemy.shouldRandomizeHP) {
		hpPercent += 10 * (2 - generateRandomNumber(adventure, 5, "battle"));
	}
	enemy.setHp(Math.ceil(enemy.maxHp * hpPercent / 100));
	let tagRegex = /@{([a-zA-Z]+)}/;
	switch (enemy.name.match(tagRegex)?.[1]) { // this prevents all replaces from running; which is problematic because @{clone} assumes player and enemy counts match
		case "adventure":
			enemy.name = enemy.name.replace("@{adventure}", adventure.element);
			break;
		case "adventureOpposite":
			enemy.name = enemy.name.replace("@{adventureOpposite}", getOpposite(adventure.element));
			break;
		case "clone":
			enemy.name = enemy.name.replace("@{clone}", `Mirror ${adventure.delvers[adventure.room.enemies.length].archetype}`);
			break;
	}

	switch (enemy.element.match(tagRegex)?.[1]) { // this prevents all replaces from running; which is problematic because @{clone} assumes player and enemy counts match
		case "adventure":
			enemy.setElement(enemy.element.replace("@{adventure}", adventure.element));
			break;
		case "adventureOpposite":
			enemy.setElement(enemy.element.replace("@{adventureOpposite}", getOpposite(adventure.element)));
			break;
		case "clone":
			enemy.setElement(enemy.element.replace("@{clone}", adventure.delvers[adventure.room.enemies.length].element));
			break;
	}
	adventure.room.enemies.push(enemy);
	Enemy.setEnemyTitle(adventure.room.enemyIdMap, enemy);
}

module.exports.needsLivingTargets = function (next) {
	return (targets, user, isCrit, adventure) => {
		const livingTargets = [];
		const deadTargets = [];
		for (const target of targets) {
			if (target.hp > 0) {
				livingTargets.push(target);
			} else {
				deadTargets.push(target);
			}
		}
		if (livingTargets.length > 0) {
			const deadTargetText = "";
			if (deadTargets.length > 0) {
				deadTargetText += ` ${deadTargets.map(target => target.getName(adventure.room.enemyIdMap)).join(", ")} ${deadTargets === 1 ? "was" : "were"} already dead!`
			}
			return next(livingTargets, user, isCrit, adventure).then(resultText => {
				return `${resultText}${deadTargetText}`;
			})
		} else if (targets.length === 1) {
			return ` But ${targets[0].getName(adventure.room.enemyIdMap)} was already dead!`;
		} else {
			return ` But all targets were already dead!`;
		}
	}
}

module.exports.selectRandomOtherAlly = function (adventure, self) {
	const selfIndex = self.findMyIndex(adventure);
	const liveOtherEnemyIndexes = [];
	adventure.room.enemies.forEach((enemy, index) => {
		if (enemy.hp > 0 && index !== selfIndex) {
			liveOtherEnemyIndexes.push(index);
		}
	})
	if (selfIndex === -1 || liveOtherEnemyIndexes.length === 0) {
		return [new CombatantReference("none", -1)];
	}
	const index = liveOtherEnemyIndexes[generateRandomNumber(adventure, liveOtherEnemyIndexes.length, "battle")];
	return [new CombatantReference("enemy", index)];
}

module.exports.selectRandomFoe = function (adventure, self) {
	return [new CombatantReference("delver", generateRandomNumber(adventure, adventure.delvers.length, "battle"))];
}

module.exports.selectAllFoes = function (adventure, self) {
	return adventure.delvers.map((delver, index) => {
		return new CombatantReference("delver", index);
	})
}

module.exports.selectSelf = function (adventure, self) {
	return [new CombatantReference(self.team, self.findMyIndex(adventure))];
}

module.exports.selectNone = function (adventure, self) {
	return [new CombatantReference("none", -1)];
}

module.exports.nextRandom = function (actionName) {
	return "random";
}

module.exports.nextRepeat = function (actionName) {
	return actionName;
}
