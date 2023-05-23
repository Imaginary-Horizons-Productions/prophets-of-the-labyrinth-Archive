const Combatant = require("./Combatant");

// Represents a player's information specific to a specific delve including: delve id, stats, equipment and upgrades, and artifacts
module.exports = class Delver extends Combatant {
	// Inherited from Combatant: hp, maxHp, speed, roundSpeed, element
	constructor(idInput, nameInput, adventureIdInput) {
		super(nameInput, "delver");
		this.id = idInput;
		this.adventureId = adventureIdInput;
	}
	predict = "not picked";
	/** @type {{name: string; uses: number}[]} */
	equipment = [];
	startingArtifact = "";

	setTitle = super.setTitle;

	setHp = super.setHp;

	setSpeed = super.setSpeed;

	setStaggerThreshold = super.setStaggerThreshold;

	setElement = super.setElement;

	/** Sets the predict for the delver.
	 * @param {"Movements" | "Vulnerabilities" | "Intents" | "Health"} predictEnum
	 */
	setPredict(predictEnum) {
		this.predict = predictEnum;
		return this;
	}

	/** Overwrite of Combatant.getCritNumerator(). `hawkTailfeatherCount` included so delvers can modify value via artifacts.
	 * @param {number} hawkTailfeatherCount
	 */
	getCritNumerator(hawkTailfeatherCount) {
		return this.critNumerator + (hawkTailfeatherCount / 2);
	}

	/** Overwrite of Combatant.getCritDenominator(). `hawkTailfeatherCount` included so delvers can modify value via artifacts.
	 * @param {number} hawkTailfeatherCount
	 */
	getCritDenominator(hawkTailfeatherCount) {
		return this.critDenominator + (hawkTailfeatherCount / 2);
	}
}
