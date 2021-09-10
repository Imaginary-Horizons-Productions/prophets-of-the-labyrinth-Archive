const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require("discord.js");

var options = [];
var command = new Command("about", "Get Dungeon Tamer's description and contributors", options, false, false);

command.execute = (interaction) => {
    // Give the basic rules and information about the bot
    return new Promise((resolve, reject) => {
        let embed = new MessageEmbed().setColor('6b81eb')
            .setAuthor(`Imaginary Horizons Productions`, "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png")
            .setTitle(`About Dungeon Tamers`)
            // .setURL(/* bot invite link */)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setDescription(`BountyBot allows server members to post objectives as bounties and awards XP to the bounty hunters who complete them.`)
            .addField(`Design & Engineering`, `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Arcane_ish) )`)
            .addField(`Embed Thumbnails`, `[game-icons.net](https://game-icons.net/)`)
            .addField(`\u200B`, `**__Patrons__**\nImaginary Horizons Productions is supported on [Patreon](https://www.patreon.com/imaginaryhorizonsproductions) by generous users like you, credited below.`)
            .addField(`Cartographer Tier`, `Ralph Beish`, false)
            .addField(`Explorer Tier`, `Eric Hu`, false)
            // .setFooter("Click \"About BountyBot\" to add BountyBot to your own server! Click \"Imaginary Horizons Productions\" to go to the BountyBot announcements channel!", avatarURL)
            .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true })
            .catch(console.error)
        resolve();
    })
}

module.exports = command;
