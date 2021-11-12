const Enemy = require("./Enemy.js");
const { getEnemy } = require("./../Data/Enemies/_enemyDictionary");
const { ELEMENTS, parseCount } = require("../helpers.js");

module.exports = class Room {
	constructor() {
		this.type = ""; // enum: "battle", "merchant", "event", "rest", "boss"
		this.title = "";
		this.description = "";
		this.components = [];
		this.enemyList = {};
		this.lootList = {};
		this.round = -1;
		this.moves = [];
		this.enemies = [];
		this.enemyTitles = {};
		this.loot = {};
	}

	setType(typeEnum) {
		this.type = typeEnum;
		return this;
	}

	setTitle(titleText) {
		this.title = titleText;
		return this;
	}

	setDescription(descriptionText) {
		this.description = descriptionText;
		return this;
	}

	addEnemy(enemyName, countExpression) {
		this.enemyList[enemyName] = countExpression;
		return this;
	}

	populate(delvers, adventureElementIndex) {
		return new Promise((resolve, reject) => {
			this.round = -1;
			this.moves = [];
			this.enemies = [];
			this.enemyTitles = {};
			this.loot = {};
			let adventureElement = ELEMENTS[adventureElementIndex];
			let reverseAdventureElement = ELEMENTS[(adventureElementIndex + 3) % 6];
			for (let enemyName in this.enemyList) {
				for (let i = 0; i < parseCount(this.enemyList[enemyName], delvers.length); i++) {
					let enemy = new Enemy();
					Object.assign(enemy, getEnemy(enemyName));
					enemy.name = enemy.name.replace("@{adventure}", adventureElement);
					enemy.name = enemy.name.replace("@{adventureReverse}", reverseAdventureElement);
					enemy.name = enemy.name.replace("Clone", `Mirror ${delvers[i].name}`);
					enemy.setElement(enemy.element.replace("@{adventure}", adventureElement))
						.setElement(enemy.element.replace("@{adventureReverse}", reverseAdventureElement))
						.setElement(enemy.element.replace("Clone", delvers[i].element));
					this.enemies.push(enemy);
					Enemy.setEnemyTitle(this.enemyTitles, enemy);
				}
			}

			for (let reward in this.lootList) {
				this.loot[reward] = parseCount(this.lootList[reward], delvers.length);
			}
			resolve(this);
		})
	}
}
