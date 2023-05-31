const { MAX_MESSAGE_ACTION_ROWS, MAX_BUTTONS_PER_ROW } = require("../constants.js");
const { calculateTagContent } = require("../helpers");

module.exports = class Artifact {
	constructor(nameInput, descriptionInput, scalingDescriptionInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.scalingDescription = scalingDescriptionInput;
	}
	element = "";
	/** @type {import("discord.js").EmbedField} */
	flavorText;

	dynamicDescription(copies) {
		return calculateTagContent(this.description, [
			{ tag: 'copies', count: copies },
			{ tag: 'rows', count: MAX_MESSAGE_ACTION_ROWS },
			{ tag: 'buttons', count: MAX_BUTTONS_PER_ROW }
		]);
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
