const { WebhookClient } = require('discord.js');
const suggestWebhook = new WebhookClient({ url: "https://discord.com/api/webhooks/947923798894739519/FRwCkAwwc2IaAxUY1zeAg3bJbue4NrivUUHlxXHudJVGHzklDi17sZF3YAVmrQVCn4gd" });

module.exports = async function(modal){
  if (modal.customId.match(/^SUGGESTION/)) {
    // suggestion modal submit received
    const suggest = modal.getTextInputValue('suggest');
    try {
      await modal.deferReply({ ephemeral: true })
      modal.followUp({ content: `\\:white_check_mark: ** ** **Merci pour votre suggestion !**\n> Votre suggestion :\n\`\`\`\n${suggest}\`\`\``, ephemeral: true }).catch(() => false)
      const averageColor = await modal.user.displayAvatarURL({ size: 128, format: 'png' }).averageColor("hex");
      let msg = await suggestWebhook.send({
        username: modal.user.tag,
        avatarURL: modal.user.displayAvatarURL({ size: 2048, format: "png", dynamic: true }),
        embeds: [
          {
            title: "Nouvelle suggestion",
            description: suggest,
            color: averageColor,
            timestamp: new Date(),
            footer: {
              text: "Suggestion de " + modal.user.tag
            }
          }
        ]
      }).catch((err) => console.log(err));
      msg = await client.channels.cache.get("947923771690475571").messages.fetch(msg.id);
      (["🟢","⚪","🔴"].map((r) => msg?.react(r).catch((err) => console.log(err))));
    } catch(err) {}
  }
}