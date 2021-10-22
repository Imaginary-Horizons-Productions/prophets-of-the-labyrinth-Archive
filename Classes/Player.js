// Represents a player's overall profile, including unlocked artifacts and archetypes and score
module.exports = class Player {
	constructor(idInput) {
		this.id = idInput;
		this.scores = {};
		this.artifacts = {};
		this.archetypes = { "Knight": 1, "Assassin": 1, "Chemist": 1 }; //TODO #36 roll starting classes randomly
	}
}
