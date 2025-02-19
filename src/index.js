require("dotenv").config({ path: (__dirname + "/.env") });

const { Client, GatewayIntentBits, Partials, Collection, Events } = require('discord.js');


const Handler = require('./libraries/Handler');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
    partials: [
        Partials.Channel, // For handling partial messages
        Partials.Message, // For handling partial messages
        Partials.Reaction // For handling partial reactions
    ]
});

client.commands = new Collection();
client.categories = new Collection();

(async () => { 


    client.login(process.env.TOKEN);
    console.log(process.env.TOKEN)
 

    client.handler = new Handler(client);

    await client.handler.loadCommands("../proccesors/commands");
    await client.handler.loadEvents("../proccesors/events");
    await client.handler.loadButtons("../proccesors/buttons");
     await client.handler.uploadCommands(process.env.CLIENTID,process.env.GUILDID, process.env.TOKEN);

    client.sendError = (msg, content) => {
        return msg.reply({ content: `🧐 - **${content}**`, components: [] });
    }; 
    client.editError = (msg, content) => {
        return msg.edit({ content: `🧐 - **${content}**`, components: [] });
    };
})();