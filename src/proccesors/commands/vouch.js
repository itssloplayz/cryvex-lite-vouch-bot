const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('vouch')
        .addStringOption(option =>
            option.setName('product')
                .setDescription(`product you bought`)
                .setRequired(true)
        )
        .addNumberOption(option => 
            option.setName('price')
                .setDescription(`price`)
                .setRequired(true)
                .setMinValue(0.01)
                .setMaxValue(1000)
        )
        .addIntegerOption(option => 
            option.setName('rating')
                .setDescription(`rating`)
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(5)
        ),
        
        
    async execute(interaction) {
        try {
        await interaction.deferReply({ ephemeral: true });
        const rating = interaction.options.getInteger('rating');
        const currentDate = new Date();
        const formattedDateTime = currentDate.toLocaleString();

        const approveButton = new ButtonBuilder()
            .setCustomId('approve_vouch')
            .setLabel('Approve')
            .setStyle(ButtonStyle.Success);

        const declineButton = new ButtonBuilder()
            .setCustomId('decline_vouch')
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(approveButton, declineButton);
        const product = interaction.options.getString('product');
        const price = interaction.options.getNumber('price');

        const StaffRoleId = process.env.STAFFROLE;
        const AproveVouchChannelId = process.env.APROVECHANNEL;

        let rate = "⭐";
        rate = "⭐".repeat(rating);
        
        const reviewEmbed = new EmbedBuilder()
            .setTitle("Customer Review")
            .setDescription(rate)
            .setColor(0x07e0a8) 
            .addFields(
            { name: "Item Purchased:", value: product },
            { name: "Price:", value: `€${price}`, inline: true },
            { name: "Purchase Time:", value: `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, inline: true }
        )
        .setAuthor({ name: `Thanks to ${interaction.user.username} for the vouch!`, icon : interaction.user.avatarURL() })
            .setFooter({
            text: "Cryvex Lite │ Shop now",
            iconURL: "https://media.discordapp.net/attachments/1323651653164990497/1326970749499478097/KfhNHv5.png?ex=67a798d0&is=67a64750&hm=8fbf630cfca677c89c20523b482f509cdae7dbe24d778d0429a1586a6c2cd487&=&width=935&height=935"
            });
        
        const channel = interaction.client.channels.cache.get(AproveVouchChannelId);
        if (channel) {
            await channel.send({content: `<@&${StaffRoleId}> A new vouch has been submitted for approval. Please approve or decline it.`, embeds: [reviewEmbed], components: [row] });
            await interaction.followUp({ content: "Your vouch has been sent for approval.", ephemeral: true });
        } else {
            await interaction.followUp({ content: "Approval channel not found.", ephemeral: true });
        }
        
        } catch (error) {
            console.error("An error occurred during process:", error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: "An error occurred. Please try again later.",
                    ephemeral: true,
                });
            } else {
                await interaction.followUp({
                    content: "An error occurred. Please try again later.",
                    ephemeral: true,
                });
            }
        }
    },
};