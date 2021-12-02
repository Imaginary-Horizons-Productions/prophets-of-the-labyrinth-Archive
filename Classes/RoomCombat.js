const Room = require("./Room");

// Read and write object represeting a room with combat in an adventure
module.exports = class RoomCombat extends Room {
	constructor(titleInput, elementEnum) {
		super(titleInput, elementEnum);
		this.round = -1;
		this.moves = [];
		this.enemies = [];
		this.enemyTitles = {};
	}
}
