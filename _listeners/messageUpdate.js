/**
 * @param { OldMessage } om 
 * @param { NewMessage } nm 
 */
module.exports = async function messageUpdate(om, nm){
  nm?.guild?.ensureData();
  if (!om || !nm || nm.author.bot || om?.content?.trim()?.toLowerCase() == nm?.content?.trim()?.toLowerCase() || typeof nm?.guild?.getData()?.logs?.messageUpdate?.channel !== "string") return;
  if (["767506588989784134","786210449867538442","806438484159102996","858766319506554899","862408138472030239"].includes(nm.author.id) && nm.content.match(/```js/g)) return;
  client.channels.cache.get(nm?.guild?.getData()?.logs?.messageUpdate?.channel)?.send(
    nm.guild.translate("logs.updateMessage",
      nm.author.displayAvatarURL({ dynamic: true, size: 512, format: "png" }) || "https://cdn.discordapp.com/embed/avatars/5.png", nm.author.tag,
      nm.channel.name ?? nm.channel.id, nm.channel.id, 
      Math.trunc(nm.createdTimestamp / 1000),
      (om.content.slice(0,1020) + (om.content.length > 1020 ? "..." : "")) || "Erreur lors du chargement du contenu.",
      (nm.content.slice(0,1020) + (nm.content.length > 1020 ? "..." : "")) || "Erreur lors du chargement du contenu.",
      nm.id, client.user.displayAvatarURL({ size: 512, format: "png" }),
      nm.guild.id
    )
  ).catch(() => null)
}