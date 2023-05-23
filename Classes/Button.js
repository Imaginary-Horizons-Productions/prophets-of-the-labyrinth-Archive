const { Interaction } = require("discord.js");

module.exports = class Button {
	/** Discord button interaction wrapper
	 * @param {string} nameInput
	 * @param {(interaction: Interaction, args: Array<string>) => void} executeFunction
	 */
	constructor(nameInput, executeFunction) {
		this.name = nameInput;
		this.execute = executeFunction;
	}
}
