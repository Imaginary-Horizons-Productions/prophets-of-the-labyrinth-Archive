// Read and write object represeting a room in an adventure
module.exports = class Room {
	constructor(titleInput, embedColorInput) {
		this.title = titleInput;
		this.embedColor = embedColorInput;
		this.loot = { "gold": 0 };
	}
}
