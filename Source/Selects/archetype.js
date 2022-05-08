const { MessageActionRow, MessageButton } = require('discord.js');
const { SAFE_DELIMITER } = require('../../helpers.js');
const Archetype = require('../../Classes/Archetype.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

module.exports = new Select("archetype");

module.exports.execute = (interaction, args) => {
	// Add the player's delver object to the adventure
	let adventure = getAdventure(interaction.channel.id);
	if (adventure?.state === "config") {
		// Add delver to list (or overwrite)
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (delver) {
			let archetype = interaction.values[0];
			let isSwitching = delver.title !== "";
			let archetypeTemplate = Object.assign(new Archetype(), getArchetype(archetype));
			delver.equipment = archetypeTemplate.signatureEquipment.map(equipmentName => {
				return { name: equipmentName, uses: getEquipmentProperty(equipmentName, "maxUses") }
			});
			delver.setTitle(archetypeTemplate.title)
				.setHp(archetypeTemplate.maxHp)
				.setSpeed(archetypeTemplate.speed)
				.setElement(archetypeTemplate.element)
				.setPredict(archetypeTemplate.predict);

			// Send confirmation text
			interaction.update({
				content: archetypeTemplate.description,
				components: [new MessageActionRow().addComponents(
					interaction.component.setPlaceholder("Pick a different archetype...")
				)]
			});
			interaction.channel.send(`${interaction.user} ${isSwitching ? "has switched to" : "will be playing as"} ${archetype}.`).then(() => {
				// Check if all ready
				if (adventure.delvers.every(delver => delver.title)) {
					let readyButton = [
						new MessageActionRow().addComponents(
							new MessageButton().setCustomId("ready")
								.setEmoji("👑")
								.setLabel("Ready!")
								.setStyle("SUCCESS")
						)
					];

					// if startMessageId already exists, player has changed class, so delete extra start message
					if (adventure.messageIds.start) {
						interaction.channel.messages.delete(adventure.messageIds.start);
						delete adventure.messageIds.start;
					}

					interaction.channel.send({ content: "All players are ready, the adventure will start when the leader clicks the button below!", components: readyButton }).then(message => {
						adventure.messageIds.start = message.id;
						setAdventure(adventure);
					})
				}
				setAdventure(adventure);
			})
		} else {
			let join = new MessageActionRow().addComponents(
				new MessageButton().setCustomId(`join${SAFE_DELIMITER}${interaction.guildId}${SAFE_DELIMITER}${interaction.channelId}${SAFE_DELIMITER}aux`)
					.setLabel("Join")
					.setStyle("SUCCESS"));
			interaction.reply({ content: `You don't appear to be signed up for this adventure. You can join with the button below:`, components: [join], ephemeral: true });
		}
	} else {
		interaction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
	}
}
