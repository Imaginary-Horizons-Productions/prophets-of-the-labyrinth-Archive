// Read and write object for adventure.room.resources
module.exports = class Resource {
	constructor(nameInput, resourceTypeInput, countInput, uiTypeInput, costInput) {
		this.name = nameInput; // Note: all names in the combined pool of equipment, artifacts, and resources must be unique
		this.resourceType = resourceTypeInput; // enum: "equipment", "artifact", "gold", "scouting", "forgeSupplies", "challenge"
		this.count = countInput;
		this.uiType = uiTypeInput; // enum: "loot", "merchant", "resource"
		this.cost = costInput;
	}

	setUIGroup(selectName) {
		// token for which select to categorize under (if applicable)
		this.uiGroup = selectName;
		return this;
	}
}
