// Represents a player's overall profile, including unlocked artifacts and archetypes and score
module.exports = class Player {
	constructor(idInput) {
		this.id = idInput;
		this.nextFreeRoll = Date.now(); //TODO #36 roll starting classes randomly
	}
	/** @type {{[guildId]: {total: number, high: number}}} */
	scores = {};
	artifacts = { "start": "Phoenix Fruit Blossom" };
	/** @type {{[archetypeName]: highScore}} set highScore to null to signify "not unlocked yet" */
	archetypes = { "Knight": 0, "Assassin": 0, "Chemist": 0, "Martial Artist": 0, "Hemomancer": 0, "Ritualist": 0 };
}
