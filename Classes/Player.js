// Represents a player's overall profile, including unlocked artifacts and characters and score
module.exports = class Player {
	constructor(idInput) {
		this.id = idInput;
		this.scores = {};
		this.artifacts = {};
		this.characters = { "knight": 1, "assassin": 1 };
	}
}
