module.exports = class RoomTemplate {
	/** This read-only data class defines stats for a room
	 * @param {string} titleText room titles double as the id, so must be unique (likely to change for localization)
	 */
	constructor(titleText) {
		this.title = titleText;
	 }
	title = "";
	description = "";
	element = "";
	uiRows = [];
	enemyList = {};
	resourceList = {};

	setDescription(descriptionText) {
		this.description = descriptionText;
		return this;
	}

	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	addEnemy(enemyName, countExpression) {
		this.enemyList[enemyName] = countExpression;
		return this;
	}
}
