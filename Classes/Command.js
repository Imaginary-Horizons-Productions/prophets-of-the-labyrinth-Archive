const { SlashCommandBuilder } = require("@discordjs/builders");

// Command Template Class
module.exports = class Command {
	constructor(nameInput, descriptionInput, optionsInput, managerCommandInput, premiumCommandInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.options = optionsInput;
		this.managerCommand = managerCommandInput;
		this.premiumCommand = premiumCommandInput;
		this.data = new SlashCommandBuilder()
			.setName(nameInput)
			.setDescription(descriptionInput);
		optionsInput.forEach(option => {
			switch (option.type) {
				case "Number":
					this.data.addNumberOption(built => built.setName(option.name).setDescription(option.description).setRequired(option.required));
					break;
				case "Integer":
					this.data.addIntegerOption(built => built.setName(option.name).setDescription(option.description).setRequired(option.required));
					break;
				case "User":
					this.data.addUserOption(built => built.setName(option.name).setDescription(option.description).setRequired(option.required));
					break;
				case "Channel":
					this.data.addChannelOption(built => built.setName(option.name).setDescription(option.description).setRequired(option.required));
					break;
				case "Role":
					this.data.addRoleOption(built => built.setName(option.name).setDescription(option.description).setRequired(option.required));
					break;
				case "Boolean":
					this.data.addBooleanOption(built => built.setName(option.name).setDescription(option.description).setRequired(option.required));
					break;
				case "String":
					this.data.addStringOption(built => {
						built.setName(option.name).setDescription(option.description).setRequired(option.required)
						if (Object.keys(option.choices).length > 0) {
							Object.keys(option.choices).forEach(choiceKey => {
								built.addChoice(choiceKey, option.choices[choiceKey]);
							})
						}
						return built;
					})
					break;
			}
		})
	}

	execute(interaction, state, metrics) { }
}
