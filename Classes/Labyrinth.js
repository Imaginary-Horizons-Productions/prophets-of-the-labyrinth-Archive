module.exports = class Labyrinth {
	/** This read-only data class defines the contents and properties of a specific labyrinth
	 * @param {string} nameInput
	 * @param {"Fire" | "Water" | "Earth" | "Wind" | "Untyped"} elementInput
	 * @param {number} maxDepthInput integer
	 * @param {Array<number>} bossRoomDepthsInput
	 */
	constructor(nameInput, elementInput, maxDepthInput, bossRoomDepthsInput) {
		this.name = nameInput;
		this.element = elementInput;
		this.maxDepth = maxDepthInput;
		this.bossRoomDepths = bossRoomDepthsInput;
	}
	availableConsumables = []; //TODO #465 merge consumable changes into base labyrinth
	availableEquipment = []; //TODO #464 merge equipment changes into base labyrinth
	avaialableRooms = [];

	/**
	 * @param {object} consumables
	 */
	setConsumables(consumables) {
		this.availableConsumables = consumables;
		return this;
	}

	/**
	 * @param {object} equipment
	 */
	setEquipment(equipment) {
		this.availableEquipment = equipment;
		return this;
	}

	/**
	 * @param {object} consumables
	 */
	setRooms(rooms) {
		this.avaialableRooms = rooms;
		return this;
	}
}
