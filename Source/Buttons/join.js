const Button = require('../../Classes/Button.js');
const Delver = require('../../Classes/Delver.js');
const { isSponsor } = require('../../helpers.js');
const { getGuild } = require('../guildDAO.js');
const { getAdventure, setAdventure } = require("./../adventureDAO.js").injectConfig(true);

module.exports = new Button("join");

module.exports.execute = async (interaction, [guildId, adventureId]) => {
	// Join an existing adventure
	let guildProfile = getGuild(interaction.guildId);
	if (isSponsor(interaction.user.id) || !guildProfile.adventuring.has(interaction.user.id)) {
		let adventure = getAdventure(adventureId);
		if (adventure.state === "config") {
			let recruitMessage = interaction.message;
			if (!recruitMessage.hasThread) {
				recruitMessage = await interaction.channel.fetchStarterMessage();
			}
			if (adventure.delvers.length < 12) {
				if (!adventure.delvers.some(delver => delver.id == interaction.user.id)) {
					// Update game logic
					adventure.delvers.push(new Delver(interaction.user.id, interaction.member.displayName, adventureId));
					adventure.lives++;
					adventure.gainGold(50);
					setAdventure(adventure);
					guildProfile.adventuring.add(interaction.user.id);

					// Welcome player to thread
					let thread = interaction.client.guilds.resolve(guildId).channels.resolve(adventureId);
					thread.send(`${interaction.member} joined the adventure.`).then(_message => {
						if (adventure.messageIds.start) {
							thread.messages.delete(adventure.messageIds.start);
							adventure.messageIds.start = "";
						}
					});

					// Update recruit message
					let partyList = `Leader: <@${adventure.leaderId}>`;
					for (let delver of adventure.delvers) {
						if (delver.id !== adventure.leaderId) {
							partyList += `\n<@${delver.id}>`;
						}
					}
					let embeds = [];
					if (recruitMessage.embeds[0]) {
						embeds = [recruitMessage.embeds[0].spliceFields(0, 1, { name: `${adventure.delvers.length} Party Member${adventure.delvers.length == 1 ? "" : "s"}`, value: partyList })];
					}
					let components = recruitMessage.components;
					if (adventure.delvers.length > 11) {
						components = [];
					}
					recruitMessage.edit({ embeds, components });
					let isInteractionInsideThread = interaction.message.flags.has("EPHEMERAL");
					if (isInteractionInsideThread) {
						interaction.update({ components: [] })
					} else {
						interaction.update({ content: "\u200B" })
					}
				} else {
					interaction.reply({ content: "You are already part of this adventure!", ephemeral: true })
						.catch(console.error);
				}
			} else {
				recruitMessage.edit({ components: [] });
				interaction.update({ content: "Due to UI limitations, maximum number of delvers on an adventure is 12.", components: [], ephemeral: true });
			}
		} else {
			interaction.reply({ content: "This adventure has already started, but you can recruit for your own with `/delve`.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Delving in more than one adventure per server is a premium perk. Use `/support` for more details.", ephemeral: true });
	}
}
