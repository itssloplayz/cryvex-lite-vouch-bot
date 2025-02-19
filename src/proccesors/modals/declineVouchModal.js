const { EmbedBuilder } = require('discord.js');

module.exports = {
  customId: "declineVouchModal",
  async execute(interaction) {
    const reason = interaction.fields.getTextInputValue('reasonInput');
    const message = interaction.message;

    if (!message) {
      return interaction.reply({
        content: 'Could not locate the original message to update.',
        ephemeral: true
      });
    }
    let embed;
    if (message.embeds.length > 0) {
      embed = EmbedBuilder.from(message.embeds[0]);
    } else {
      embed = new EmbedBuilder();
    }
    embed.owner = 1
    console.log(await embed);
    embed.setColor('Red');
    embed.setAuthor({ name: `Vouch was declined: ${reason}` });

    await message.edit({ embeds: [embed], components: [] });

    await interaction.reply({
      content: 'The vouch has been declined successfully.',
      ephemeral: true
    });
  }
};