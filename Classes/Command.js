const { SlashCommandBuilder } = require("@discordjs/builders");

// Command Template Class
module.exports = class Command {
	constructor(nameInput, descriptionInput, managerCommandInput, premiumCommandInput, optionsInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.managerCommand = managerCommandInput;
		this.premiumCommand = premiumCommandInput;
		this.data = new SlashCommandBuilder()
			.setName(nameInput)
			.setDescription(descriptionInput);
		optionsInput.forEach(option => {
			this.data[`add${option.type}Option`](built => {
				built.setName(option.name)
					.setDescription(option.description)
					.setRequired(option.required);
				if (option.autocomplete === true) {
					built.setAutocomplete(true);
				}
				else if (option.choices === null || option.choices === undefined) {
					throw `Error: ${this.nameInput} (${descriptionInput}) ${option.type} Option was nullish.`;
				}
				else if (option.choices.length) {
					built.addChoices(...option.choices);
				}
				return built;
			})
		})
	}

	execute(interaction) { }
}
