const Combatant = require("./Combatant");

// Represents a player's information specific to a specific delve including: delve id, stats, weapons and upgrades, and artifacts
module.exports = class Delver extends Combatant {
	// Inherited from Combatant: hp, maxHp, speed, roundSpeed, element
	constructor(idInput, nameInput, adventureIdInput) {
		super(nameInput, "delver");
		this.id = idInput;
		this.adventureId = adventureIdInput;
	}
	predict = "not picked";
	weapons = []; // {name, uses}
	startingArtifact = "";

	setTitle = super.setTitle;

	setHp = super.setHp;

	setSpeed = super.setSpeed;

	setStaggerThreshold = super.setStaggerThreshold;

	setElement = super.setElement;

	setPredict = (predictEnum) => {
		this.predict = predictEnum;
		return this;
	}
}
