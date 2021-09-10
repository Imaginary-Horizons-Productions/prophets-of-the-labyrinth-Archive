const { SlashCommandBuilder } = require("@discordjs/builders");

// Command Template Class
module.exports = class Command {
	constructor(nameInput, descriptionInput, managerCommandInput, premiumCommandInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.managerCommand = managerCommandInput;
		this.premiumCommand = premiumCommandInput;
		this.data = new SlashCommandBuilder()
			.setName(nameInput)
			.setDescription(descriptionInput);
	}

	execute(interaction, state, metrics) { }
}
