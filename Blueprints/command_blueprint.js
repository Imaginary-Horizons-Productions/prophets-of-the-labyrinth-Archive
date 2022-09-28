const { Interaction } = require('discord.js');
const Command = require('../../Classes/Command.js');

const id = "name";
const options = [
	{ type: "", name: "", description: "", required: false, choices: [] }
];
module.exports = new Command(id, "description", false, false, options);

/** Command specifications go here
 * @param {Interaction} interaction
 */
module.exports.execute = (interaction) => {

}
