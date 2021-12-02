const Room = require("./Room");

// Read and write object represeting a room with combat in an adventure
module.exports = class RoomCombat extends Room {
	constructor(titleInput, embedColorInput) {
		super(titleInput, embedColorInput);
		this.round = -1;
		this.moves = [];
		this.enemies = [];
		this.enemyTitles = {};
	}
}
