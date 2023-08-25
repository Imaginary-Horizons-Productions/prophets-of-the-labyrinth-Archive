const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Archetype = require('../../Classes/Archetype.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO');
const { getArchetype } = require('../Archetypes/_archetypeDictionary.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

const customId = "archetype";
module.exports = new Select(customId, (interaction, args) => {
	// Add the player's delver object to the adventure
	const adventure = getAdventure(interaction.channel.id);
	if (adventure?.state === "config") {
		// Add delver to list (or overwrite)
		const delver = adventure.delvers.find(delver => delver.id == interaction.user.id);
		const archetype = interaction.values[0];
		const isSwitching = delver.archetype !== "";
		const archetypeTemplate = Object.assign(new Archetype(), getArchetype(archetype));
		delver.equipment = archetypeTemplate.signatureEquipment.map(equipmentName => {
			return { name: equipmentName, uses: getEquipmentProperty(equipmentName, "maxUses") }
		});
		delver.setArchetype(archetypeTemplate.name)
			.setHp(archetypeTemplate.maxHp)
			.setSpeed(archetypeTemplate.speed)
			.setElement(archetypeTemplate.element)
			.setPredict(archetypeTemplate.predict);

		setAdventure(adventure);

		// Send confirmation text
		interaction.update({
			content: archetypeTemplate.description,
			components: [new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder(interaction.component.data).setPlaceholder("Pick a different archetype...")
			)]
		});
		interaction.channel.send(`${interaction.user} ${isSwitching ? "has switched to" : "will be playing as"} ${archetype}.`);
	} else {
		interaction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
	}
});
