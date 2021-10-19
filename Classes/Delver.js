const Combatant = require("./Combatant");

// Represents a player's information specific to a specific delve including: delve id, difficulty options, stats, weapons and upgrades, and artifacts
module.exports = class Delver extends Combatant {
	// Inherited from Combatant: hp, maxHp, speed, roundSpeed, elements
	constructor(idInput, nameInput, adventureIdInput) {
		super(nameInput, "ally");
		this.id = idInput;
		this.adventureId = adventureIdInput;
	}
	read;
	weapons = [];

	setTitle = super.setTitle;

	setHp = super.setHp;

	setSpeed = super.setSpeed;

	setElement = super.setElement;

	setRead = (readType) =>{
		this.read = readType;
		return this;
	}
}
