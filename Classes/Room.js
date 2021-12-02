// Read and write object represeting a room in an adventure
module.exports = class Room {
	constructor(titleInput, elementEnum) {
		this.title = titleInput;
		this.element = elementEnum;
		this.loot = { "gold": 0 };
	}
}
