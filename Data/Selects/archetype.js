const Archetype = require('../../Classes/Archetype.js');
const Delver = require('../../Classes/Delver.js');
const Weapon = require('../../Classes/Weapon.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, saveAdventures } = require('../adventureDAO');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');
const { getWeapon } = require('../Weapons/_weaponDictionary');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = new Select("archetype");

module.exports.execute = (interaction, args) => {
	// Add the player's delver object to the adventure
	let adventure = getAdventure(interaction.channel.id);
	if (adventure) {
		let archetypeTemplate = Object.assign(new Archetype, getArchetype(interaction.values[0]));
		let delver = new Delver(interaction.user.id, interaction.member.displayName, interaction.channel.id)
			.setTitle(archetypeTemplate.title)
			.setHp(archetypeTemplate.maxHp)
			.setSpeed(archetypeTemplate.speed)
			.setElement(archetypeTemplate.element)
			.setPredict(archetypeTemplate.predict);
		archetypeTemplate.signatureWeapons.forEach(weaponName => {
			delver.weapons.push(Object.assign(new Weapon(), getWeapon(weaponName)));
		})

		// Add delver to list (or overwrite)
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		if (userIndex === -1) {
			adventure.delvers.push(delver);
		} else {
			adventure.delvers.splice(userIndex, 1, delver);
		}

		// Check if all ready
		let confirmationText = "";
		let readyButton = [];
		let allReady = adventure.lives - 1 === adventure.delvers.length;
		if (allReady) { // Lives equals player count + 1; no opportunity to lose lives before adventure starts
			readyButton.push(new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`ready-${interaction.channel.id}`)
						.setLabel("Ready!")
						.setStyle("SUCCESS")
				))
			confirmationText += "\n\nAll players are ready, the adventure can start when the leader clicks the button below!";

			// if startMessageId already exists, player has changed class, so delete extra start button
			if (adventure.messageIds.start) {
				interaction.channel.messages.fetch(adventure.messageIds.start).then(startMessage => {
					startMessage.edit({ components: [] });
				})
			}
		}

		// Send confirmation text
		confirmationText = `${interaction.user} will be playing as ${interaction.values[0]}.${confirmationText}`;
		interaction.reply({ content: confirmationText, components: readyButton, fetchReply: allReady }).then(message => {
			adventure.setMessageId("start", message.id);
		}).catch(console.error);
		saveAdventures();
	} else {
		interaction.reply({ content: "This adventure seems to be over already.", ephemeral: true });
	}
}
