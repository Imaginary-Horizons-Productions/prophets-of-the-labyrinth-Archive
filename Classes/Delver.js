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

	/**
	 * Sets the predict for the delver.
	 *
	 * @param {string} predictEnum
	 * @returns {Delver}
	 */
	setPredict(predictEnum) {
		this.predict = predictEnum;
		return this;
	}

	/**
	 * Overwrite of Combatant.getCritNumerator(). `count` included so delvers can modify value via artifacts.
	 *
	 * @param {number} hawkTailfeatherCount
	 * @returns {number}
	 */
	getCritNumerator(hawkTailfeatherCount) {
		return this.critNumerator + hawkTailfeatherCount;
	}

	/**
	 * Overwrite of Combatant.getCritDenominator(). `count` included so delvers can modify value via artifacts.
	 *
	 * @param {number} hawkTailfeatherCount
	 * @returns {number}
	 */
	 getCritDenominator(hawkTailfeatherCount) {
		return this.critDenominator + hawkTailfeatherCount;
	}
}
