const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, MessageFlags } = require('discord.js');
const Archetype = require('../../Classes/Archetype.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

const id = "archetype";
module.exports = new Select(id, (interaction, args) => {
	// Add the player's delver object to the adventure
	let adventure = getAdventure(interaction.channel.id);
	if (adventure?.state === "config") {
		// Add delver to list (or overwrite)
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let archetype = interaction.values[0];
		let isSwitching = delver.archetype !== "";
		let archetypeTemplate = Object.assign(new Archetype(), getArchetype(archetype));
		delver.equipment = archetypeTemplate.signatureEquipment.map(equipmentName => {
			return { name: equipmentName, uses: getEquipmentProperty(equipmentName, "maxUses") }
		});
		const wasReady = adventure.delvers.every(delver => delver.title);
		delver.setArchetype(archetypeTemplate.name)
			.setHp(archetypeTemplate.maxHp)
			.setSpeed(archetypeTemplate.speed)
			.setElement(archetypeTemplate.element)
			.setPredict(archetypeTemplate.predict);

		// Send confirmation text
		interaction.update({
			content: archetypeTemplate.description,
			components: [new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder(interaction.component.data).setPlaceholder("Pick a different archetype...")
			)]
		});
		interaction.channel.send(`${interaction.user} ${isSwitching ? "has switched to" : "will be playing as"} ${archetype}.`).then(() => {
			// Check if all ready... wasReady is used to guarantee only one ready-button in a racecondition
			if (adventure.delvers.every(delver => delver.archetype) && !wasReady) {
				let readyButton = [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder().setCustomId("startadventure")
							.setEmoji("👑")
							.setLabel("Ready!")
							.setStyle(ButtonStyle.Success)
					)
				];

				// if adventure.messageIds.start already exists, player has changed class, so delete extra start message
				if (adventure.messageIds.start) {
					interaction.channel.messages.delete(adventure.messageIds.start);
					delete adventure.messageIds.start;
				}

				interaction.channel.send({ content: "All players are ready, the adventure will start when the leader clicks the button below!", components: readyButton, flags: MessageFlags.SuppressNotifications }).then(message => {
					adventure.messageIds.start = message.id;
					setAdventure(adventure);
				})
			}
			setAdventure(adventure);
		})
	} else {
		interaction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
	}
});
