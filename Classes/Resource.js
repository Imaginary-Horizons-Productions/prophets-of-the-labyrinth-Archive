// Read and write object for adventure.room.resources
module.exports = class Resource {
	/**
	 * @param {string} nameInput Note: all names in the combined pool of equipment, artifacts, consumables, and resources must be unique
	 * @param {"equipment" | "artifact" | "gold" | "scouting" | "roomActions" | "challenge"} resourceTypeInput
	 * @param {number} countInput
	 * @param {"loot" | "merchant" | "resource"} uiTypeInput
	 * @param {number} costInput
	 * @returns {Resource}
	 */
	constructor(nameInput, resourceTypeInput, countInput, uiTypeInput, costInput) {
		this.name = nameInput;
		this.resourceType = resourceTypeInput;
		this.count = countInput;
		this.uiType = uiTypeInput;
		this.cost = costInput;
	}

	/** Only necessary for UI with multiple generated selects (eg merchants)
	 * @param {string} selectName
	 * @returns {Resource}
	 */
	setUIGroup(selectName) {
		this.uiGroup = selectName;
		return this;
	}
}
