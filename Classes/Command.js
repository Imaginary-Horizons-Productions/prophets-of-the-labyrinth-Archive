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
				built.setName(option.name).setDescription(option.description).setRequired(option.required);
				if (option.choices === null || option.choices === undefined) {
					console.log(descriptionInput);
					throw `Error: ${this.nameInput} ${option.type} Option was nullish.`;
				}
				let choiceEntries = Object.entries(option.choices);
				if (choiceEntries.length) {
					built.addChoices(Object.entries(option.choices));
				}
				return built;
			})
		})
	}

	execute(interaction) { }
}
