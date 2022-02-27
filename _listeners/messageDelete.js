/**
 * @param { Message } message
 */
 module.exports = async function messageDelete(message){
  message?.guild?.ensureData();
  if ((!message.content && message.attachments.size < 1) || typeof message?.guild?.getData()?.logs?.messageDelete?.channel !== "string") return;
  if (["767506588989784134","786210449867538442","806438484159102996","858766319506554899","862408138472030239"].includes(message.author.id) && message.content.match(/```js/g)) return;
  let msg = message.guild.translate("logs.deleteMessage.assets",
    message.author.displayAvatarURL({ dynamic: true, size: 512, format: "png" }) || "https://cdn.discordapp.com/embed/avatars/5.png", message.author.tag,
    message.channel.name ?? message.channel.id, message.channel.id, 
    Math.trunc(message.createdTimestamp / 1000),
    typeof message.content == "string" && message.content.length > 0 ? (message.content.slice(0,1020) + (message.content.length > 1020 ? "..." : "")) : message.guild.translate("logs.messageDelete.noContent"),
    message.id, client.user.displayAvatarURL({ size: 512, format: "png" }), message.channel.toString()
  );
  if (message.attachments.size > 0) {
    msg.embeds[0].fields.push(message.guild.translate("logs.deleteMessage.fileJoins"));
    if (!(msg.components instanceof Array)) msg.components = [];
    if (!msg.components[0]?.type || !(msg.components[0].components instanceof Array)) msg.components[0] = { type: 1, components: [] };
    if (message.attachments.size <= 4) {
      message.attachments.array().forEach((attachment, index) => {
        msg.components[0].components.push({
          label: `Fichier joint n°${index + 1}`,
          url: attachment.url ?? "https://discord.com/",
          style: 5,
          type: 2
        });
      });
    } else {
      message.attachments.array().splitArray(4).forEach((table, index) => {
        msg.components[index] = { type: 1, components: [] };
        table.forEach((attachment, i) => {
          msg.components[index].components.push({
            label: `Fichier joint n°${(i + 1)+(index*4)}`,
            url: attachment.url ?? "https://discord.com/",
            style: 5,
            type: 2
          });
        });
      })
    }
  }
  client.channels.cache.get(message?.guild?.getData()?.logs?.messageDelete?.channel)?.send(msg).catch(() => null);
}