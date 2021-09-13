const GuildProfile = require("./Classes/GuildProfile.js")
const { saveGuild, getGuild } = require("./Data/guildList.js")
const { getPlayer, setPlayer } = require("./Data/playerList.js")

exports.guildSetup = function (guild) {
    guild.channels.create("Dungeon Tamers", {
        type: "GUILD_CATEGORY"
    }).then(category => {
        guild.channels.create("dungeon-tamers-central", {
            type: "GUILD_TEXT",
            parent: category
        }).then(channel => {
            var guildProfile = getGuild(guild.id);
            if (guildProfile) {
                guildProfile.userIds.forEach(playerId => {
                    var player = getPlayer(playerId, guild.id);
                    player.score[guild.id] = 0;
                    setPlayer(player);
                });
            }
            saveGuild(new GuildProfile(guild.id, category.id, channel.id));
        })
    })
}
