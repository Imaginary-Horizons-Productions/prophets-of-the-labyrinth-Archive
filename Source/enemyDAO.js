const Enemy = require("../Classes/Enemy.js");
const { generateRandomNumber } = require("../helpers.js");
const { getOpposite } = require("./elementHelpers.js");

module.exports.spawnEnemy = function (adventure, enemyTemplate, randomizeHp) {
	let enemy = Object.assign(new Enemy(), enemyTemplate);
	enemy.modifiers = { ...enemyTemplate.startingModifiers }; // breaks shared reference to modifiers object by enemies of same name
	let hpPercent = 85 + 15 * adventure.delvers.length;
	if (randomizeHp) {
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
			enemy.name = enemy.name.replace("@{clone}", `Mirror ${adventure.delvers[adventure.room.enemies.length].title}`);
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
	Enemy.setEnemyTitle(adventure.room.enemyTitles, enemy);
}

module.exports.selectRandomOtherAlly = function (adventure, self) {
	const selfIndex = adventure.room.enemies.findIndex(enemy => enemy.lookupName === self.lookupName && enemy.title === self.title);
	const liveOtherEnemyIndexes = [];
	adventure.room.enemies.forEach((enemy, index) => {
		if (enemy.hp > 0 && index !== selfIndex) {
			liveOtherEnemyIndexes.push(index);
		}
	})
	if (selfIndex === -1 || liveOtherEnemyIndexes.length === 0) {
		return [{ team: "none", index: "none" }];
	}
	let index = liveOtherEnemyIndexes[generateRandomNumber(adventure, liveOtherEnemyIndexes.length, "battle")];
	return [{ team: "enemy", index }];
}

module.exports.selectRandomFoe = function (adventure, self) {
	let team = "delver";
	let index = generateRandomNumber(adventure, adventure.delvers.length, "battle");
	return [{ team, index }];
}

module.exports.selectAllFoes = function (adventure, self) {
	return adventure.delvers.map((delver, index) => {
		return {
			team: "delver",
			index
		}
	})
}

module.exports.selectSelf = function (adventure, self) {
	let team = "self";
	let index = adventure.room.enemies.findIndex(enemy => enemy.name === self.name && enemy.title === self.title);
	return [{ team, index }];
}

module.exports.selectNone = function (adventure, self) {
	return [{ team: "none", index: "none" }];
}

module.exports.nextRandom = function (actionName) {
	return "random";
}

module.exports.nextRepeat = function (actionName) {
	return actionName;
}
