const { MAX_MESSAGE_ACTION_ROWS, MAX_BUTTONS_PER_ROW } = require("../constants.js");
const { calculateTagContent } = require("../helpers");

module.exports = class Artifact {
	constructor(nameInput, descriptionInput) {
		this.name = nameInput;
		this.description = descriptionInput;
	}
	element = "";
	/** @type {import("discord.js").EmbedField} */
	flavorText;

	dynamicDescription(copies) {
		let description = calculateTagContent(this.description, 'copies', copies);
		description = calculateTagContent(description, 'rows', MAX_MESSAGE_ACTION_ROWS);
		return calculateTagContent(description, 'buttons', MAX_BUTTONS_PER_ROW);
	}

	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	setFlavorText(embedFieldData) {
		this.flavorText = embedFieldData;
		return this;
	}
}
