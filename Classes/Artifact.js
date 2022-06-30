const { parseCount, MAX_MESSAGE_ACTION_ROWS, MAX_BUTTONS_PER_ROW } = require("../helpers");

module.exports = class Artifact {
	constructor(nameInput, descriptionInput) {
		this.name = nameInput;
		this.description = descriptionInput;
	}
	element = "";
	flavorText = [];

	dynamicDescription(copies) {
		let description = this.description;
		let copiesExpression = description.match(/@{(copies[\*\d]*)}/)?.[1].replace(/copies/g, "n");
		if (copiesExpression) {
			copies = parseCount(copiesExpression, copies);
		}

		return description.replace(/@{copies.*}/g, copies).replace(/@{rows}/g, MAX_MESSAGE_ACTION_ROWS).replace(/@{buttons}/g, MAX_BUTTONS_PER_ROW);
	}

	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	setFlavorText(fieldArray) {
		this.flavorText = fieldArray;
		return this;
	}
}
