module.exports = class ConsumableTemplate {
	constructor(nameInput, descriptionInput, effectFunction) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.effect = effectFunction;
	}
	element = "";
	flavorText = [];

	/** A consumable's element determines which drop table it's in
	 * @param {string} elementEnum
	 * @returns {ConsumableTemplate}
	 */
	setElement(elementEnum) {
		this.element = elementEnum;
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
