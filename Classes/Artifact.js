module.exports = class Artifact {
	constructor(nameInput, descriptionInput) {
		this.name = nameInput;
		this.description = descriptionInput;
	}
	element = "";
	flavorText = [];

	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	setFlavorText(fieldArray) {
		this.flavorText = fieldArray;
		return this;
	}
}
