module.exports = class ConsumableTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {Function} selectTargetsFunction
	 * @param {Function} effectFunction
	 */
	constructor(nameInput, descriptionInput, selectTargetsFunction, effectFunction) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.selectTargets = selectTargetsFunction;
		this.effect = effectFunction;
	}
	element = "";
	targetDescription = "";
	targetTeam = "";
	flavorText = [];

	/** A consumable's element determines which drop table it's in
	 * @param {string} elementEnum
	 * @returns {ConsumableTemplate}
	 */
	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	/** Unlike the selector function which controls the game logic, these tags control UI/feedback logic
	 * @param {"single" | "all" | "random→x" | "self" | "none"} targetDescriptionEnum
	 * @param {"delver" | "enemy" | "any" | "none"} targetTeamEnum
	 * @returns {ConsumableTemplate}
	 */
	setTargetTags(targetDescriptionEnum, targetTeamEnum) {
		this.targetDescription = targetDescriptionEnum;
		this.targetTeam = targetTeamEnum;
		return this;
	}

	/** Sets the texts to display in the flavor text embed field
	 * @param {[heading, value]} fieldArray
	 * @returns {ConsumableTemplate}
	 */
	setFlavorText(fieldArray) {
		this.flavorText = fieldArray;
		return this;
	}
}
