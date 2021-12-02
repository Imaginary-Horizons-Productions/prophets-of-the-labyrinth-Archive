const Enemy = require("../Classes/Enemy");
const { generateRandomNumber, ELEMENTS } = require("../helpers");

module.exports.spawnEnemy = function (adventure, enemyTemplate, randomizeHp) {
	enemyTemplate.modifiers = {}; // breaks shared reference to modifiers object by enemies of same name
	let enemy = Object.assign(new Enemy(), enemyTemplate);
	if (randomizeHp) {
		let hpPercent = (10 * generateRandomNumber(adventure, 4, "battle") + 80) / 100;
		enemy.setHp(Math.ceil(enemy.maxHp * hpPercent));
	}
	let tagRegex = /@{([a-zA-Z]+)}/;
	switch (enemy.name.match(tagRegex)?.[1]) { // this prevents all replaces from running; which is problematic because clone replace makes assumes player and enemy counts match
		case "adventure":
			enemy.name = enemy.name.replace("@{adventure}", adventure.element);
			break;
		case "adventureReverse":
			let reverseAdventureElement = ELEMENTS[(ELEMENTS.findIndex(element => element === adventure.element) + 3) % 6];
			enemy.name = enemy.name.replace("@{adventureReverse}", reverseAdventureElement);
			break;
		case "clone":
			enemy.name = enemy.name.replace("@{clone}", `Mirror ${adventure.delvers[adventure.room.enemies.length].title}`);
			break;
	}

	switch (enemy.element.match(tagRegex)?.[1]) { // this prevents all replaces from running; which is problematic because clone replace makes assumes player and enemy counts match
		case "adventure":
			enemy.setElement(enemy.element.replace("@{adventure}", adventure.element));
			break;
		case "adventureReverse":
			let reverseAdventureElement = ELEMENTS[(ELEMENTS.findIndex(element => element === adventure.element) + 3) % 6];
			enemy.setElement(enemy.element.replace("@{adventureReverse}", reverseAdventureElement));
			break;
		case "clone":
			enemy.setElement(enemy.element.replace("@{clone}", adventure.delvers[adventure.room.enemies.length].element));
			break;
	}
	adventure.room.enemies.push(enemy);
	Enemy.setEnemyTitle(adventure.room.enemyTitles, enemy);
}

module.exports.selectRandomFoe = function (adventure, self) {
	let team = "ally";
	let index = generateRandomNumber(adventure, adventure.delvers.length, "battle");
	return [{ team, index }];
}

module.exports.selectAllFoes = function (adventure, self) {
	return adventure.delvers.map((delver, index) => {
		return {
			team: "ally",
			index
		}
	})
}

module.exports.selectSelf = function (adventure, self) {
	let team = "enemy";
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
