const Command = require('../../Classes/Command.js');
const { embedTemplate } = require('../../helpers.js');
const { getEmoji, getWeakness, getColor } = require('../elementHelpers.js');

const id = "manual";
const options = [
	{
		type: "String", name: "topic", description: "The topic/page of information", required: true, choices: [
			{ name: "Credits", value: "Credits" },
			{ name: "Tutorial", value: "Tutorial" },
			{ name: "Elements", value: "Elements" },
			{ name: "Stagger", value: "Stagger" },
			{ name: "Damage Cap", value: "Damage Cap" },
			{ name: "Data Policy", value: "Data Policy" }
		]
	}
];
module.exports = new Command(id, "Get information about Prophets of the Labyrinth v0.8.0", false, false, options);

module.exports.execute = (interaction) => {
	// Give information about the game
	let response = { ephemeral: true };
	switch (interaction.options.getString(options[0].name)) {
		case "Credits":
			response.embeds = [embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Prophets of the Labyrinth v0.8.0")
				.setThumbnail(interaction.client.user.displayAvatarURL())
				.setDescription(`A roguelike dungeon crawl in Discord to play with other server members.`)
				.addFields([
					{ name: `Design & Engineering`, value: `Nathaniel Tseng ( <@106122478715150336> | [GitHub](https://github.com/ntseng) )` },
					{ name: `Dev & Review`, value: `Henry Hu ( <@113108081990176768> | [Twitter](https://twitter.com/hdoubledh) )` },
					{ name: `Boba Dev`, value: `Vivian Thach ( <@334803621827051534> | [Instagram](https://www.instagram.com/bobaguardian/) )` },
					{ name: "Random Number Generator", value: "Alex Frank" },
					{ name: "Room Loader", value: "Michel Momeyer" },
					{ name: "Predict Balance", value: "Lucas Ensign" },
					{ name: "Playtesting", value: "Ralph Beishline, Eric Hu, TheChreative, Jon Puddicombe" },
					{ name: `Embed Thumbnails`, value: `[game-icons.net](https://game-icons.net/)` }
				])
			];
			break;
		case "Tutorial":
			response.embeds = [embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Prophets of the Labyrinth Tutorial")
				.setDescription("Prophets of the Labyrinth (or PotL) is a multiplayer roguelike dungeon crawl played directly on Discord. Each dungeon delve will start a new thread where players can discuss their strategies and votes.")
				.addFields([
					{ name: "Voting", value: "During a delve, your team will explore various rooms. At the end of exploring each room, the party will vote on which room to explore next. The party must reach a consensus to continue, and you are encouraged to talk your reasoning in the thread." },
					{ name: "Combat", value: "If you encounter enemies (such as during the Final Battle in the last room), each player will be prompted to pick a move to do during the next turn. When everyone has selected their move, the game will report the results. Each character archetype starts with different equipment and, importantly, predicts different information about the upcoming round. Make sure to share your info with your party!" },
					{ name: "Suggested Party Size", value: "Though the game has player count scaling, it is balanced primarily for groups of 3-6. Due to UI limitations, the max party size is 12. ***It is highly recommended to avoid playing by yourself.***" }
				])
			];
			break;
		case "Elements":
			response.embeds = [embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Elements")
				.setDescription("Each combatant is associated with one of the following elements: Fire, Wind, Water, Earth. Based on this element, damage they receive may be increased, decreased, or not changed based on the element of the received damage (damage can be \"Untyped\"). This change is calculated before block.")
				.addFields([
					{ name: `Fire ${getEmoji("Fire")}`, value: `Weakness (2x damage from): ${getEmoji(getWeakness("Fire"))}\nResistance (1/2 damage from): ${getEmoji("Fire")}\nColor: ${getColor("Fire")}` },
					{ name: `Wind ${getEmoji("Wind")}`, value: `Weakness (2x damage from): ${getEmoji(getWeakness("Wind"))}\nResistance (1/2 damage from): ${getEmoji("Wind")}\nColor: ${getColor("Wind")}` },
					{ name: `Water ${getEmoji("Water")}`, value: `Weakness (2x damage from): ${getEmoji(getWeakness("Water"))}\nResistance (1/2 damage from): ${getEmoji("Water")}\nColor: ${getColor("Water")}` },
					{ name: `Earth ${getEmoji("Earth")}`, value: `Weakness (2x damage from): ${getEmoji(getWeakness("Earth"))}\nResistance (1/2 damage from): ${getEmoji("Earth")}\nColor: ${getColor("Earth")}` },
					{ name: "Matching Element Stagger", value: "When a combatant makes a move that matches their element, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 1 additional Stagger. Check the page on Stagger to learn more about Stagger and Stun." }
				])
			];
			break;
		case "Stagger":
			response.embeds = [embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Stagger")
				.setDescription("Stagger is a modifier (that is neither a buff nor debuff) that stacks up on a combatant eventually leading to the combatant getting Stunned (also not a buff or debuff). A stunned combatant misses their next turn, even if they had readied a move for that turn. Stagger promotes to Stun when a combatant's number of stacks exceeds their Stagger threshold (default 3 for delvers, varies for enemies).")
				.addFields({ name: "Matching Element Stagger", value: "When a combatant makes a move that matches their element, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 1 additional Stagger. Check the page on Elements to learn more about move and combatant elements." })
			];
			break;
		case "Damage Cap":
			response.embeds = [
				embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Damage Cap")
					.setDescription("The maximum amount of damage that can be done in one shot after block is 500. This cap is raised for each stack of Power Up a user has.")
			];
			break;
		case "Data Policy":
			response.embeds = [
				embedTemplate(interaction.client.user.displayAvatarURL()).setTitle("Data Policy")
					.setDescription("*Prophets of the Labyrinth* uses the following user data:\n- Discord account for associating with player progression and scores\n- Guild membership to associate players with adventures")
			];
			break;
	}
	interaction.reply(response)
		.catch(console.error)
}
