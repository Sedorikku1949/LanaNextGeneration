const { Message } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals') // Now we extract the showModal method
const modal = new Modal() // We create a Modal
  .setCustomId('modal-customid')
  .setTitle('Test of Discord-Modals!')
  .addComponents(
    new TextInputComponent() // We create a Text Input Component
    .setCustomId('textinput-customid')
    .setLabel('Some text Here')
    .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
    .setMinLength(4)
    .setMaxLength(10)
    .setPlaceholder('Write a text here')
    .setRequired(true) // If it's required or not
  );


module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (interaction instanceof Message) {
    // message, need options[0]
  } else {
    // slashCommand, send modal

    showModal(modal, {
      client: client,
      interaction: interaction
    })
  }
}

module.exports.config = {
  name: "suggestion",
  aliase: ["suggest"],
  category: "util",
  defer: false,
  options: [],
  system: {
    requiredPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPermission: [],
    staff: false,
    dev: false,
    inProgress: false,
    isUserCommand: false,
    isSlashCommand: true
  },
  lang: null,
  path: null
}