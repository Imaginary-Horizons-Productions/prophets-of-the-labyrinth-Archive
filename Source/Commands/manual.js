const Command = require('../../Classes/Command.js');
const { MessageEmbed } = require("discord.js");
const { getEmoji, getWeaknesses, getResistances, getColor } = require('../elementHelpers.js');

const options = [
	{
		type: "String", name: "topic", description: "The topic/page of information", required: true, choices: {
			"Credits": "Credits",
			"Tutorial": "Tutorial",
			"Elements": "Elements",
			"Stagger": "Stagger",
			"Damage Cap": "Damage Cap"
		}
	}
];
module.exports = new Command("manual", "Get information about Prophets of the Labyrinth (v0.7.0)", false, false, options);

// imports from files that depend on /Config
// let ;
module.exports.injectConfig = function (isProduction) {
	return this;
}

module.exports.execute = (interaction) => {
	// Give information about the game
	let response = { ephemeral: true };
	switch (interaction.options.getString("topic")) {
		case "Credits":
			response.embeds = [embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Prophets of the Labyrinth v0.7.0")
				.setThumbnail(interaction.client.user.displayAvatarURL())
				.setDescription(`A roguelike dungeon crawl in Discord to play with other server members.`)
				.addField(`Design & Engineering`, `Nathaniel Tseng ( <@106122478715150336> | [GitHub](https://github.com/ntseng) )`)
				.addField(`Dev & Review`, `Henry Hu ( <@113108081990176768> | [Twitter](https://twitter.com/hdoubledh) )`)
				.addField("Random Number Generator", "Alex Frank")
				.addField("Room Loader", "Michel Momeyer")
				.addField("Predict Balance", "Lucas Ensign")
				.addField("Playtesting", "Ralph Beishline, Eric Hu, TheChreative, Jon Puddicombe")
				.addField(`Embed Thumbnails`, `[game-icons.net](https://game-icons.net/)`)
			];
			break;
		case "Tutorial":
			response.embeds = [embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Prophets of the Labyrinth Tutorial")
				.setDescription("Prophets of the Labyrinth (or PotL) is a multiplayer roguelike dungeon crawl played directly on Discord. Each dungeon delve will start a new thread where players can discuss their strategies and votes.")
				.addField("Voting", "During a delve, your team will explore various rooms. At the end of exploring each room, the party will vote on which room to explore next. The party must reach a consensus to continue, and you are encouraged to talk your reasoning in the thread.")
				.addField("Combat", "If you encounter enemies (such as during the Final Battle in the last room), each player will be prompted to pick a move to do during the next turn. When everyone has selected their move, the game will report the results. Each character archetype starts with different weapons and, importantly, predicts different information about the upcoming round. Make sure to share your info with your party!")
				.addField("Suggested Party Size", "Though the game has player count scaling, it is balanced primarily for groups of 3-6. Due to UI limitations, the max party size is 12. ***It is highly recommended to avoid playing by yourself.***")
			];
			break;
		case "Elements":
			response.embeds = [embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Elements")
				.setDescription("Each combatant is associated with one of the following elements: Fire, Wind, Light, Water, Earth, Darkness. Based on this element, damage they receive may be increased, decreased, or not changed based on the element of the received damage (damage can be \"Untyped\"). This change is calculated before block.")
				.addField(`Fire ${getEmoji("Fire")}`, `Weaknesses (2x damage from): ${getWeaknesses("Fire").map(element => getEmoji(element)).join(", ")}\nResistances (1/2 damage from): ${getResistances("Fire").map(element => getEmoji(element)).join(", ")}\nColor: ${getColor("Fire")}`)
				.addField(`Wind ${getEmoji("Wind")}`, `Weaknesses (2x damage from): ${getWeaknesses("Wind").map(element => getEmoji(element)).join(", ")}\nResistances (1/2 damage from): ${getResistances("Wind").map(element => getEmoji(element)).join(", ")}\nColor: ${getColor("Wind")}`)
				.addField(`Light ${getEmoji("Light")}`, `Weaknesses (2x damage from): ${getWeaknesses("Light").map(element => getEmoji(element)).join(", ")}\nResistances (1/2 damage from): ${getResistances("Light").map(element => getEmoji(element)).join(", ")}\nColor: ${getColor("Light")}`)
				.addField(`Water ${getEmoji("Water")}`, `Weaknesses (2x damage from): ${getWeaknesses("Water").map(element => getEmoji(element)).join(", ")}\nResistances (1/2 damage from): ${getResistances("Water").map(element => getEmoji(element)).join(", ")}\nColor: ${getColor("Water")}`)
				.addField(`Earth ${getEmoji("Earth")}`, `Weaknesses (2x damage from): ${getWeaknesses("Earth").map(element => getEmoji(element)).join(", ")}\nResistances (1/2 damage from): ${getResistances("Earth").map(element => getEmoji(element)).join(", ")}\nColor: ${getColor("Earth")}`)
				.addField(`Darkness ${getEmoji("Darkness")}`, `Weaknesses (2x damage from): ${getWeaknesses("Darkness").map(element => getEmoji(element)).join(", ")}\nResistances (1/2 damage from): ${getResistances("Darkness").map(element => getEmoji(element)).join(", ")}\nColor: ${getColor("Darkness")}`)
				.addField("Matching Element Stagger", "When a combatant makes a move that matches their element, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 1 additional Stagger. Check the page on Stagger to learn more about Stagger and Stun.")
			];
			break;
		case "Stagger":
			response.embeds = [embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Stagger")
				.setDescription("Stagger is a modifier (that is neither a buff nor debuff) that stacks up on a combatant eventually leading to the combatant getting Stunned (also not a buff or debuff). A stunned combatant misses their next turn, even if they had readied a move for that turn. Stagger promotes to Stun when a combatant's number of stacks exceeds their Stagger threshold (default 3 for delvers, varies for enemies).")
				.addField("Matching Element Stagger", "When a combatant makes a move that matches their element, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 1 additional Stagger. Check the page on Elements to learn more about move and combatant elements.")
			];
			break;
		case "Damage Cap":
			response.embeds = [
				embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Damage Cap")
					.setDescription("The maximum amount of damage that can be done in one shot after block is 500. This cap is raised for each stack of Power Up a user has.")
			];
			break;
	}
	interaction.reply(response)
		.catch(console.error)
}

function embedTemplate(iconURL) {
	return new MessageEmbed().setColor('6b81eb')
		.setAuthor({ name: "Click here to vist the PotL GitHub", iconURL, url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth" })
		.setURL("https://discord.com/api/oauth2/authorize?client_id=950469509628702740&permissions=397284665360&scope=applications.commands%20bot")
		.setFooter({ text: "Click the title link to add PotL to your server", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
}
