const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure, completeAdventure, updateRoomHeader } = require('../adventureDAO.js');
const { gainHealth, dealDamage } = require("../combatantDAO.js");
const { editButton } = require('../roomDAO.js');

module.exports = new Button("hpshare");

module.exports.execute = (interaction, args) => {
	// Take hp from user, give to party members
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (delver) {
		if (adventure.gold >= 50) {
			adventure.gold -= 50;
			dealDamage(delver, null, 50, "untyped", adventure).then(damageText => {
				updateRoomHeader(adventure, interaction.message);
				adventure.delvers.forEach(delver => {
					if (delver.id !== interaction.user.id) {
						gainHealth(delver, 50, adventure.room.enemyTitles);
					}
				})
				return interaction.reply(`${damageText} Everyone else gains 5 hp.`);
			}).then(() => {
				let updatedUI = editButton(interaction.message, "hpshare", true, "✔️", `${interaction.user} shared HP.`);
				interaction.update({ components: updatedUI });
				if (adventure.lives < 1) {
					completeAdventure(adventure, interaction.channel, new MessageEmbed().setTitle("Defeat"));
				}
			})
		}
	} else {
		interaction.reply({ content: "Please share hp in adventures you've joined.", ephemeral: true });
	}
}
