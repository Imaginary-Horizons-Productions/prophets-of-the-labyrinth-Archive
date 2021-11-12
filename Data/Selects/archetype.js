const Archetype = require('../../Classes/Archetype.js');
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
		// Add delver to list (or overwrite)
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		if (userIndex !== -1) {
			let archetypeTemplate = Object.assign(new Archetype(), getArchetype(interaction.values[0]));
			adventure.delvers[userIndex].weapons = archetypeTemplate.signatureWeapons.map(weaponName => {
				// Reassign weapons (instead of pushing) in case player is changing archetype
				return Object.assign(new Weapon(), getWeapon(weaponName));
			});
			adventure.delvers[userIndex].setTitle(archetypeTemplate.title)
				.setHp(archetypeTemplate.maxHp)
				.setSpeed(archetypeTemplate.speed)
				.setElement(archetypeTemplate.element)
				.setPredict(archetypeTemplate.predict);

			// Send confirmation text
			interaction.reply(`${interaction.user} will be playing as ${interaction.values[0]}`).then(() => {
				// Check if all ready
				if (adventure.delvers.every(delver => delver.title)) {
					let readyButton = [
						new MessageActionRow().addComponents(
							new MessageButton().setCustomId(`ready-${interaction.channel.id}`)
								.setLabel("Ready!")
								.setStyle("SUCCESS")
						)
					];

					// if startMessageId already exists, player has changed class, so delete extra start button
					if (adventure.messageIds.start) {
						interaction.channel.messages.fetch(adventure.messageIds.start).then(startMessage => {
							startMessage.edit({ components: [] });
						})
					}

					interaction.channel.send({ content: "All players are ready, the adventure will start when the leader clicks the button below!", components: readyButton }).then(message => {
						adventure.setMessageId("start", message.id);
					})
				}
			})
			saveAdventures();
		} else {
			let join = new MessageActionRow().addComponents(
				new MessageButton().setCustomId(`join-${interaction.channel.id}`)
					.setLabel("Join")
					.setStyle("PRIMARY"));
			interaction.reply({ content: `You don't appear to be signed up for this adventure. You can join with the button below:`, components: [join], ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This adventure seems to be over already.", ephemeral: true });
	}
}
