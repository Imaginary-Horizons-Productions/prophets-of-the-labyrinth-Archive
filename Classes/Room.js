const Resource = require("./Resource");
const RoomTemplate = require("./RoomTemplate");

module.exports.Room = class {
	/** This read-write payload class describes a room in an adventure
	 * @param {RoomTemplate} roomTemplate
	 * @param roomTemplate.types Saving the generated type only would cause the game to lose track of Treasure rooms that were rolled as Event rooms.
	 */
	constructor({ title: titleInput, element: elementEnum, enemyList }) {
		this.title = titleInput;
		this.element = elementEnum;
		this.hasEnemies = Object.keys(enemyList).length > 0;

		if (this.hasEnemies) {
			this.round = -1;
			this.moves = [];
			this.enemies = [];
			this.enemyIdMap = {};
		}
	}
	/** @type {Record<string, Resource>} */
	resources = {};
};
