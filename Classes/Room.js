const Enemy = require("./Enemy.js");
const { getEnemy } = require("./../Data/Enemies/_enemyDictionary");
const { ELEMENTS } = require("../helpers.js");

module.exports = class Room {
	constructor() {
		this.type = ""; // enum: "battle", "merchant", "event", "rest", "boss"
		this.title = "";
		this.description = "";
		this.components = [];
		this.enemyList = {};
		this.lootList = {};
		this.round = 0;
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

	populate(delverCount, adventureElementIndex) {
		return new Promise((resolve, reject) => {
			this.round = 0;
			this.moves = [];
			this.enemies = [];
			this.enemyTitles = {};
			this.loot = {};
			for (let enemyName in this.enemyList) {
				let countExpression = this.enemyList[enemyName];
				let enemyCount = countExpression.split("*").reduce((total, term) => {
					return total * (term === "n" ? delverCount : new Number(term));
				}, 1);
				for (let i = 0; i < Math.ceil(enemyCount); i++) {
					let enemy = new Enemy();
					Object.assign(enemy, getEnemy(enemyName));
					enemy.setElement(enemy.element.replace("@{adventure}", ELEMENTS[adventureElementIndex]))
						.setElement(enemy.element.replace("@{adventureReverse}", ELEMENTS[(adventureElementIndex + 3) % 6]));
					this.enemies.push(enemy);
					Enemy.setEnemyTitle(this.enemyTitles, enemy);
				}
			}

			for (let reward in this.lootList) {
				let rewardExpression = this.lootList[reward];
				let rewardCount = rewardExpression.split("*").reduce((total, term) => {
					return total * (term === "n" ? delverCount : new Number(term));
				}, 1);
				this.loot[reward] = rewardCount;
			}
			resolve(this);
		})
	}
}
