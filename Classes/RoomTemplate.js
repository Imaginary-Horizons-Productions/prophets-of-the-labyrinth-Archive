// A readonly object containing stats for a room
module.exports = class RoomTemplate {
	constructor() { }
	types = []; // enum: "Battle", "Merchant", "Event", "Rest Site", "Final Battle", "Relic Guardian", "Forge"
	title = "";
	description = "";
	element = "";
	uiRows = [];
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

	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	addEnemy(enemyName, countExpression) {
		this.enemyList[enemyName] = countExpression;
		return this;
	}
}
