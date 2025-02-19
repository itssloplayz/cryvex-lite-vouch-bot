const {
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle
  } = require('discord.js');
  
  module.exports = {
    customId: "decline_vouch",
    async execute(interaction) {
    
      const modal = new ModalBuilder()
        .setCustomId('declineVouchModal')
        .setTitle('Decline Vouch Reason');
  
   
      const reasonInput = new TextInputBuilder()
        .setCustomId('reasonInput')
        .setLabel('Reason for declining')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Enter the reason here...')
        .setRequired(true);
  

      const actionRow = new ActionRowBuilder().addComponents(reasonInput);
      modal.addComponents(actionRow);
 
      await interaction.showModal(modal);
      
     
    }
  };
  