// A readonly object containing stats for a room
module.exports = class RoomTemplate {
	constructor() { }
	types = []; // enum: "battle", "merchant", "event", "rest", "finalboss", "midboss", "forge"
	title = "";
	description = "";
	components = [];
	enemyList = {};
	lootList = {};

	setTypes(...typeEnum) {
		this.types = typeEnum;
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
}
