const Character = require('../../Classes/Character.js');
const Delver = require('../../Classes/Delver.js');
const Weapon = require('../../Classes/Weapon.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, saveAdventures } = require('../adventureDAO');
const { characterDictionary } = require('../Characters/_characterDictionary.js');
const { weaponDictionary } = require('../Weapons/_weaponDictionary');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = new Select("delver");

module.exports.execute = (interaction, args) => {
	// Add the player's delver object to the adventure
	let adventure = getAdventure(interaction.channel.id);
	let characterTemplate = Object.assign(new Character, characterDictionary[interaction.values[0]]);
	let delver = new Delver(interaction.user.id, interaction.member.displayName, interaction.channel.id)
		.setTitle(characterTemplate.title)
		.setHp(characterTemplate.maxHp)
		.setSpeed(characterTemplate.speed)
		.setElement(characterTemplate.element);
	characterTemplate.signatureWeapons.forEach(weaponName => {
		delver.weapons.push(Object.assign(new Weapon(), weaponDictionary[weaponName]));
	})

	// Add delver to list (or overwrite)
	let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
	if (userIndex === -1) {
		adventure.delvers.push(delver);
	} else {
		adventure.delvers.splice(i, 1, delver);
	}

	// Check if all ready
	let confirmationText = "";
	let readyButton = [];
	if (adventure.lives - 1 === adventure.delvers.length) { // Lives equals player count + 1; no opportunity to lose lives before adventure starts
		readyButton.push(new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(`ready-${interaction.channel.id}`)
					.setLabel("Ready!")
					.setStyle("SUCCESS")
			))
		confirmationText += " All players are ready, have the leader click the button below to start!";
	}

	// Send confirmation text
	confirmationText = `${interaction.user} will be playing as ${interaction.values[0]}.` + confirmationText;
	interaction.reply({ content: confirmationText, components: readyButton })
		.catch(console.error);
	saveAdventures();
}
