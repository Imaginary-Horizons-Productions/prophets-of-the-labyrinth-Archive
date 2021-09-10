//#region Imports
const { Client } = require("discord.js");
//#endregion

//#region Globals
const versionData = require('./Data/Config/versionData.json');
const { commandDictionary, slashData } = require(`./Commands/_commandList.js`);
const { selectDictionary } = require("./Selects/_selectList.js");
const client = new Client({
    retryLimit: 5,
    presence: {
        activities: [{
            name: "/tutorial",
            type: "LISTENING"
        }]
    },
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
});
//#endregion

client.login(require("./Data/Config/auth.json").token);

client.on("ready", () => {
    console.log(`Connected as ${client.user.tag}`);
})

client.on("interactionCreate", interaction => {
    if (interaction.isCommand()) {
        commandDictionary[interaction.commandName].execute(interaction).then(() => {
        })
    }
})
