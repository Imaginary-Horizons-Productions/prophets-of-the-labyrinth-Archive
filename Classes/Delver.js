const Combatant = require("./Combatant");

// Represents a player's information specific to a specific delve including: delve id, stats, equipment and upgrades, and artifacts
module.exports = class Delver extends Combatant {
	// Inherited from Combatant: hp, maxHp, speed, roundSpeed, element
	constructor(idInput, nameInput, adventureIdInput) {
		super(nameInput, "delver");
		this.id = idInput;
		this.adventureId = adventureIdInput;
	}
	isReady = false;
	/** @type {{name: string; uses: number}[]} */
	equipment = [];
	startingArtifact = "";

	setArchetype = super.setArchetype;

	setHp = super.setHp;

	setSpeed = super.setSpeed;

	setStaggerThreshold = super.setStaggerThreshold;

	setElement = super.setElement;

	getName() {
		return this.name;
	}

	findMyIndex(adventure) {
		return adventure.delvers.findIndex(delver => delver.id === this.id);
	}
}
