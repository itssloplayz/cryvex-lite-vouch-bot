const { REST, Routes, Collection, InteractionType } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

class Handler {
    constructor(client) {
        this.client = client;
        this.client.commands = new Collection();
        this.client.slashCommands = new Collection();
        this.client.categories = new Collection();
        this.client.events = new Collection();
        this.client.buttons = new Collection();
        this.client.modals = new Collection(); // New collection for modals

        // Load commands, events, buttons, and modals
        this.loadCommands("../proccesors/commands");
        this.loadEvents("../proccesors/events");
        this.loadButtons("../proccesors/buttons");
        this.loadModals("../proccesors/modals");
        
        // Single interactionCreate listener for commands, buttons, and modals
        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.isCommand()) {
                return this.handleInteraction(interaction);
            } else if (interaction.isButton()) {
                return this.handleButtons(interaction);
            } else if (interaction.type === InteractionType.ModalSubmit) {
                return this.handleModals(interaction);
            }
        });
    }

    async loadCommands(dir) {
        let files = await fs.readdir(path.join(__dirname, dir));
        for (let file of files) {
            let stat = await fs.lstat(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                await this.loadCommands(path.join(dir, file));
            } else if (file.endsWith(".js")) {
                try {
                    let cmdModule = require(path.join(__dirname, dir, file));
                    if (cmdModule.data) {
                        this.client.slashCommands.set(cmdModule.data.name, cmdModule);
                    }
                    this.client.commands.set(cmdModule.data?.name || file, cmdModule);
                } catch (e) {
                    console.log("ERROR", `Error loading command '${file}': ${e.message}`);
                }
            }
        }
    }

   
    async loadEvents(dir) {
        let files = await fs.readdir(path.join(__dirname, dir));
        for (let file of files) {
            let stat = await fs.lstat(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                await this.loadEvents(path.join(dir, file));
            } else if (file.endsWith(".js")) {
                try {
                    let eventModule = require(path.join(__dirname, dir, file));
                    let eventName = file.replace(".js", "");
                    this.client.on(eventName, eventModule.bind(null, this.client));
                } catch (e) {
                    console.log("ERROR", `Error loading event '${file}': ${e.message}`);
                }
            }
        }
    }

    async loadButtons(dir) {
        let files = await fs.readdir(path.join(__dirname, dir));
        for (let file of files) {
            let stat = await fs.lstat(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                await this.loadButtons(path.join(dir, file));
            } else if (file.endsWith(".js")) {
                try {
                    let buttonModule = require(path.join(__dirname, dir, file));
                    if (buttonModule.customId) {
                        this.client.buttons.set(buttonModule.customId, buttonModule);
                    }
                } catch (e) {
                    console.log("ERROR", `Error loading button '${file}': ${e.message}`);
                }
            }
        }
    }

    async loadModals(dir) {
        let files = await fs.readdir(path.join(__dirname, dir));
        for (let file of files) {
            let stat = await fs.lstat(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                await this.loadModals(path.join(dir, file));
            } else if (file.endsWith(".js")) {
                try {
                    let modalModule = require(path.join(__dirname, dir, file));
                    if (modalModule.customId) {
                        this.client.modals.set(modalModule.customId, modalModule);
                    }
                } catch (e) {
                    console.log("ERROR", `Error loading modal '${file}': ${e.message}`);
                }
            }
        }
    }

    async uploadCommands(clientId, guildId, token) {
        let commands = Array.from(this.client.slashCommands.values()).map(cmd => cmd.data);
        const rest = new REST({ version: '10' }).setToken(token);
        try {
            console.log(`Uploading commands to guild ${guildId}...`);
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
            console.log('Commands successfully uploaded to the guild!');
        } catch (error) {
            console.error('Failed to upload commands:', error);
        }
    }
    

    async handleInteraction(interaction) {
        if (!interaction.isCommand()) return;
        const command = this.client.slashCommands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command '${interaction.commandName}':`, error);
            await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
        }
    }

    async handleButtons(interaction) {
        if (!interaction.isButton()) return;
        const button = this.client.buttons.get(interaction.customId);
        if (!button) return;
        try {
            await button.execute(interaction);
        } catch (error) {
            console.error(`Error executing button '${interaction.customId}':`, error);
            await interaction.reply({ content: 'There was an error executing this button interaction.', ephemeral: true });
        }
    }

    async handleModals(interaction) {
        const modal = this.client.modals.get(interaction.customId);
        if (!modal) return;
        try {
            await modal.execute(interaction);
        } catch (error) {
            console.error(`Error executing modal '${interaction.customId}':`, error);
            await interaction.reply({ content: 'There was an error executing this modal interaction.', ephemeral: true });
        }
    }
}

module.exports = Handler;
