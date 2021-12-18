// Read and write object represeting a room in an adventure
module.exports = class Room {
	constructor(titleInput, elementInput) {
		this.title = titleInput;
		this.element = elementInput;
		this.loot = { "gold": 0 };
	}

	initializeCombatProperties() {
		this.round = -1;
		this.moves = [];
		this.enemies = [];
		this.enemyTitles = {};
	}
}
