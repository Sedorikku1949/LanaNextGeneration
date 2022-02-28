const { Message } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const modal = new Modal()
  .setCustomId('SUGGESTION')
  .setTitle('Formulaire de suggestion')
  .addComponents(
    new TextInputComponent()
    .setCustomId('suggest')
    .setLabel('Votre suggestion ici')
    .setStyle('LONG')
    .setMinLength(4)
    .setMaxLength(1500)
    .setPlaceholder('Tapé votre suggestion ici')
    .setRequired(true)
  );

const { WebhookClient } = require('discord.js');
const suggestWebhook = new WebhookClient({ url: "https://discord.com/api/webhooks/947923798894739519/FRwCkAwwc2IaAxUY1zeAg3bJbue4NrivUUHlxXHudJVGHzklDi17sZF3YAVmrQVCn4gd" });


module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (interaction instanceof Message) {
    // message, need options[0]
    if (!options[0]) return ({ content: `${database.emojis.close.msg} ** ** **Quelle est votre suggestion ? Je ne peux pas deviner toute seule...**` });
    const suggest = interaction.content.split(/\s+/g).slice(1).join(' ');
    try {
      interaction.reply({ content: `\\:white_check_mark: ** ** **Merci pour votre suggestion !**\n> Votre suggestion :\n\`\`\`\n${suggest}\`\`\``, ephemeral: true }).catch(() => false)
      const averageColor = await author.displayAvatarURL({ size: 128, format: 'png' }).averageColor("hex");
      let msg = await suggestWebhook.send({
        username: author.tag,
        avatarURL: author.displayAvatarURL({ size: 2048, format: "png", dynamic: true }),
        embeds: [
          {
            title: "Nouvelle suggestion",
            description: suggest,
            color: averageColor,
            timestamp: new Date(),
            footer: {
              text: "Suggestion de " + author.tag
            }
          }
        ]
      }).catch((err) => console.log(err));
      msg = await client.channels.cache.get("947923771690475571").messages.fetch(msg.id);
      (["🟢","⚪","🔴"].map((r) => msg?.react(r).catch((err) => console.log(err))));
    } catch(err) {
      console.log(err)
    }
  } else {
    // slashCommand, send modal
    showModal(modal, {
      client: client,
      interaction: interaction
    })
    return true;
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