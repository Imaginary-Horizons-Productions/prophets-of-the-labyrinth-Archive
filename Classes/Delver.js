const Combatant = require("./Combatant");

// Represents a player's information specific to a specific delve including: delve id, difficulty options, character selected, stats, weapons and upgrades, and artifacts
module.exports = class Delver extends Combatant {
	// Inherited from Combatant: hp, maxHp, speed, roundSpeed, elements, setHp, setSpeed, setElement
	constructor(idInput, nameInput, adventureIdInput) {
		super();
		this.id = idInput;
		this.adventureId = adventureIdInput;
		super.name = nameInput;
		super.team = "ally";
	}
	readType = "weaknesses";
	weapons = [];

	setTitle = super.setTitle;

	setHp = super.setHp;

	setSpeed = super.setSpeed;

	setElement = super.setElement;

	clearBlock = super.clearBlock;
}
