const { EmbedBuilder } = require('discord.js');
const Button = require('../../Classes/Button.js');
const Delver = require('../../Classes/Delver.js');
const { maxDelverCount, ZERO_WIDTH_WHITESPACE } = require("../../constants.js");
const { isSponsor } = require('../../helpers.js');
const { getGuild } = require('../guildDAO.js');
const { getAdventure, setAdventure, fetchRecruitMessage } = require("./../adventureDAO.js");

const id = "join";
module.exports = new Button(id, async (interaction, [guildId, adventureId, context]) => {
	// Join an existing adventure
	let guildProfile = getGuild(interaction.guildId);
	if (isSponsor(interaction.user.id) || !guildProfile.adventuring.has(interaction.user.id)) {
		let adventure = getAdventure(adventureId);
		if (adventure) {
			if (adventure.state === "config") {
				let recruitMessage = interaction.message;
				if (context === "invite") {
					const guild = await interaction.client.guilds.fetch(guildId);
					const thread = await guild.channels.fetch(adventureId);
					recruitMessage = await fetchRecruitMessage(thread, adventure.messageIds.recruit);
				}
				if (adventure.delvers.length < maxDelverCount) {
					if (!adventure.delvers.some(delver => delver.id == interaction.user.id)) {
						// Update game logic
						adventure.delvers.push(new Delver(interaction.user.id, interaction.user.username, adventureId));
						adventure.lives++;
						adventure.gainGold(50);
						setAdventure(adventure);
						guildProfile.adventuring.add(interaction.user.id);

						// Welcome player to thread
						let thread = interaction.client.guilds.resolve(guildId).channels.resolve(adventureId);
						thread.send(`<@${interaction.user.id}> joined the adventure!`).then(_message => {
							if (adventure.messageIds.start) {
								thread.messages.delete(adventure.messageIds.start);
								adventure.messageIds.start = "";
							}
						});

						// Update recruit message
						let partyList = `<@${adventure.leaderId}> 👑`;
						for (let delver of adventure.delvers) {
							if (delver.id !== adventure.leaderId) {
								partyList += `\n<@${delver.id}>`;
							}
						}
						const embeds = [];
						const [{ data: recruitEmbed }] = recruitMessage.embeds;
						if (recruitEmbed) {
							embeds.push(new EmbedBuilder(recruitEmbed).spliceFields(0, 1, { name: `${adventure.delvers.length} Party Member${adventure.delvers.length == 1 ? "" : "s"}`, value: partyList }));
						}
						let components = recruitMessage.components;
						if (adventure.delvers.length === maxDelverCount) {
							components = [];
						}
						recruitMessage.edit({ embeds, components });
						if (context === "invite") {
							interaction.update({ components: [] })
						} else {
							interaction.update({ content: ZERO_WIDTH_WHITESPACE })
						}
					} else {
						interaction.reply({ content: "You are already part of this adventure!", ephemeral: true })
							.catch(console.error);
					}
				} else {
					recruitMessage.edit({ components: [] });
					interaction.update({ content: `Due to UI limitations, maximum number of delvers on an adventure is ${maxDelverCount}.`, components: [], ephemeral: true });
				}
			} else {
				interaction.reply({ content: "This adventure has already started, but you can recruit for your own with `/delve`.", ephemeral: true });
			}
		} else {
			interaction.message.edit({ components: [] });
			interaction.reply({ content: "The adventure you tried joining could not be found.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Delving in more than one adventure per server is a premium perk. Use `/support` for more details.", ephemeral: true });
	}
});
