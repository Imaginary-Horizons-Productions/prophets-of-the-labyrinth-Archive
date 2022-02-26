const Command = require('../../Classes/Command.js');
const { MessageEmbed } = require("discord.js");
const { getEmoji, getWeaknesses, getResistances, getColor } = require('../elementHelpers.js');

module.exports = new Command("manual", "Get information about Prophets of the Labyrinth", false, false);

module.exports.data.addStringOption(option => option.setName("topic").setDescription("The topic/page of information").setRequired(true)
	.setChoices([["Credits", "Credits"], ["Elements", "Elements"]]));

module.exports.execute = (interaction) => {
	// Give information about the game
	let response = { ephemeral: true };
	switch (interaction.options.getString("topic")) {
		case "Credits":
			response.embeds = [new MessageEmbed().setColor('6b81eb')
				.setTitle("Prophets of the Labyrinth v0.5.0")
				// .setURL(/* bot invite link */)
				.setThumbnail(interaction.client.user.displayAvatarURL())
				.setDescription(`A roguelike dungeon crawl in Discord to play with other server members.`)
				.addField(`Design & Engineering`, `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Arcane_ish) )`)
				.addField("Random Number Generator", "Alex Frank")
				.addField("Room Loader", "Michel Momeyer")
				.addField("Predict Balance", "Lucas Ensign")
				.addField("Playtesting", "Henry Hu, Ralph Beishline, Eric Hu, TheChreative, Jon Puddicombe")
				.addField(`Embed Thumbnails`, `[game-icons.net](https://game-icons.net/)`)
				.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
			];
			break;
		case "Elements":
			response.embeds = [new MessageEmbed().setColor('6b81eb')
				.setTitle("Elements")
				.setDescription("Each combatant is associated with one of the following elements: Fire, Wind, Light, Water, Earth, Darkness. Based on this element, damage they receive may be increased, decreased, or not changed based on the element of the received damage (damage can be \"Untyped\"). This change is calculated before block.")
				.addField(`Fire ${getEmoji("Fire")}`, `Weaknesses (receives 2x damage from): ${getWeaknesses("Fire").join(", ")}\nResistances (receives 1/2 damage from): ${getResistances("Fire").join(", ")}\nColor: ${getColor("Fire")}`)
				.addField(`Wind ${getEmoji("Wind")}`, `Weaknesses (receives 2x damage from): ${getWeaknesses("Wind").join(", ")}\nResistances (receives 1/2 damage from): ${getResistances("Wind").join(", ")}\nColor: ${getColor("Wind")}`)
				.addField(`Light ${getEmoji("Light")}`, `Weaknesses (receives 2x damage from): ${getWeaknesses("Light").join(", ")}\nResistances (receives 1/2 damage from): ${getResistances("Light").join(", ")}\nColor: ${getColor("Light")}`)
				.addField(`Water ${getEmoji("Water")}`, `Weaknesses (receives 2x damage from): ${getWeaknesses("Water").join(", ")}\nResistances (receives 1/2 damage from): ${getResistances("Water").join(", ")}\nColor: ${getColor("Water")}`)
				.addField(`Earth ${getEmoji("Earth")}`, `Weaknesses (receives 2x damage from): ${getWeaknesses("Earth").join(", ")}\nResistances (receives 1/2 damage from): ${getResistances("Earth").join(", ")}\nColor: ${getColor("Earth")}`)
				.addField(`Darkness ${getEmoji("Darkness")}`, `Weaknesses (receives 2x damage from): ${getWeaknesses("Darkness").join(", ")}\nResistances (receives 1/2 damage from): ${getResistances("Darkness").join(", ")}\nColor: ${getColor("Darkness")}`)
				.addField("Matching Element Stagger", "When a combatant makes a move that matches their element, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 1 additional Stagger. Check the page on Stagger to learn more about Stagger and Stun.")
			];
			break;
	}
	interaction.reply(response)
		.catch(console.error)
}
