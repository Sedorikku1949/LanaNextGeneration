function blacklisted(guild){
  client.users.cache.get(guild.ownerId)?.send("<:close:884084000744939571> ** ** **Vous êtes actuellement blacklist, votre accès à mes service est impossible.**").catch(() => {});
  guild.leave();
}

const Discord = require("discord.js");

const generalChannels = ["general", "chat", "discussion", "main", "💭","🗯️","💬","🗨️","🌐"]

module.exports = async function guildCreate(guild){
  if (database.system.get("blacklist").some(({ id }) => id === guild.ownerId)) return blacklisted(guild);

  // join message in support
  client.channels.cache.get(database.config.events.joinChannel)?.send({
    embeds: [{
      author: { name: client.user.tag, icon_url: client.user.displayAvatarURL({ format: "png", size: 512 }) },
      title: "J'ai été ajoutée sur un nouveau serveur !",
      color: "#42AF61",
      description: `${guild.name ? `\`${guild.name}\` **` : "**Le serveur " || "**Le serveur "}appartient à \`${client.users.cache.get(guild.ownerId)?.tag || guild.ownerId}\`**\n\n> Ce serveur a ${guild.memberCount} membres, j'ai hâte de discuter avec eux !\n\n✨ **Merci de m'avoir ajoutée !!**`,
      thumbnail: { url: guild.iconURL({ dynamic: true, size: 2048, format: "png" }) },
      timestamp: new Date(),
      footer: { text: `Je suis désormais sur ${client.guilds.cache.size} serveurs.` }
    }]
  }).catch(() => {}).then((msg) => {
    if (!msg || !(msg instanceof Discord.Message) || typeof msg?.react !== "function") return;
    msg?.react("💗").catch(() => false)
  });

  let joinedEmbeds = {
    embeds: [{
      title: "Merci de m'avoir ajoutée !",
      color: guild.translate("color.primary") ?? "#2c2f33",
      description: "** **\n**J'ai hâte de vous aider à aggrandir votre communautée !**\n\n> Si vous avez des questions, n'hésitez pas à contacter mes développeurs :wink:",
      thumbnail: { url: client.user.displayAvatarURL({ format: "png", size: 2048 }) },
    }],
    components: [{
      type: 1,
      components: [{ label: "Mon dashboard", url: "https://kady.tlkoe.xyz", style: 5, type: 2 }, { label: "Mon serveur", url: "https://discord.gg/UYgdRRYs7P", style: 5, type: 2 }]
    }]
  }

  // message in guild
  await guild.channels.fetch().catch(() => false);
  if (!guild.channels.cache.some(({ name }) => generalChannels.includes(name.toLowerCase()))) {
    if (!(guild.channels.cache.first() instanceof Discord.TextChannel)) return client.users.cache.get(guild.ownerId)?.send(joinedEmbeds).catch(() => {});
    guild.channels.cache.first()?.send(joinedEmbeds)?.catch(() => client.users.cache.get(guild.ownerId)?.send(joinedEmbeds).catch(() => {}))
  } else {
    const allChannels = guild.channels.cache.array()?.filter(({ name }) => generalChannels.includes(name.toLowerCase()));
    if (allChannels.length < 1 || typeof allChannels[0]?.send !== "function") return client.users.cache.get(guild.ownerId)?.send(joinedEmbeds).catch(() => {});
    allChannels[0]?.send(joinedEmbeds).catch(() => client.users.cache.get(guild.ownerId)?.send(joinedEmbeds).catch(() => {}))
  }
}