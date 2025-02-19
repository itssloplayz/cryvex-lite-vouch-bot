module.exports = {
    customId: "approve_vouch",
    execute: async (interaction) => {
        const embed = interaction.message.embeds[0];
        if (embed) {
            const targetChannel = interaction.client.channels.cache.get(process.env.VOUCHCHANNEL);
            const aprovechannel = interaction.client.channels.cache.get(process.env.APROVECHANNEL);
            if (targetChannel) {
                await targetChannel.send({ embeds: [embed] });
                await interaction.reply({ content: 'The vouch has been approved successfully.', ephemeral: true });
                await aprovechannel.send({ content: `Vouch approved by ${interaction.user.tag}` });
                await interaction.message.delete(); 
            } else {
                console.error('Target channel not found');
            }
        } else {
            console.error('No embed found in the message');
        }
    }
};