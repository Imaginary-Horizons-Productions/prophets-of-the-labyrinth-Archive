module.exports = class Labyrinth {
	/**
	 * @param {string} nameInput
	 * @param {"Fire" | "Water" | "Earth" | "Wind" | "Untyped"} elementInput
	 */
	constructor(nameInput, elementInput) {
		this.name = nameInput;
		this.element = elementInput;
	}
	availableConsumables = []; //TODO #465 merge consumable changes into base labyrinth
	availableEquipment = []; //TODO #464 merge equipment changes into base labyrinth
	// avaialableRooms = []; //TODO #466 add rooms to Labyrinth
	// maxDepth = 10; //TODO #467 move maxDepth to Labyrinth
	// bossRoomDepths = []; //TODO #468 move bossRoomDepths to Labyrinth

	/**
	 * @param {object} consumables
	 * @returns {Labyrinth}
	 */
	setConsumables(consumables) {
		this.availableConsumables = consumables;
		return this;
	}

	/**
	 * @param {object} equipment
	 * @returns {Labyrinth}
	 */
	setEquipment(equipment) {
		this.availableEquipment = equipment;
		return this;
	}

	/**
	 * @param {object} consumables
	 * @returns {Labyrinth}
	 */
	// setRooms(rooms) {
	// 	this.avaialableRooms = rooms;
	// 	return this;
	// }
}