const Resource = require("./Resource");

// Read and write object represeting a room in an adventure
module.exports = class Room {
	constructor(titleInput, elementInput) {
		this.title = titleInput;
		this.element = elementInput;
		this.resources = { "gold": new Resource("gold", "gold", 0, "loot", 0)};
	}

	initializeCombatProperties() {
		this.round = -1;
		this.moves = [];
		this.enemies = [];
		this.enemyTitles = {};
	}
}
