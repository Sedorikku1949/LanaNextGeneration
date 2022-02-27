module.exports = function(guild){
  client.channels.cache.get(database.config.events.joinChannel)?.send({
    embeds: [{
      author: { name: client.user.tag, icon_url: client.user.displayAvatarURL({ format: "png", size: 512 }) },
      title: "J'ai été retirée d'un serveur...",
      color: "#AF4742",
      description: `${guild.name ? `\`${guild.name}\` **` : "**Le serveur " || "**Le serveur "}appartient à \`${client.users.cache.get(guild.ownerId)?.tag || guild.ownerId}\`...**`,
      thumbnail: { url: guild.iconURL({ dynamic: true, size: 2048, format: "png" }) },
      timestamp: new Date()
    }]
  }).catch(() => {});

  database.guilds.delete(guild.id);

  client.users.cache.get(guild.ownerId)?.send({
    embeds: [{
      color: "#AF4742",
      title: "Oh non ! J'appréciais tellement votre serveur...",
      description: "> C'est tellement triste de m'avoir expulsé de votre serveur... pourriez-vous au moins indiquer à mes développeurs pourquoi m'avoir expulsé ?"
    }],
    components: [{
      type: 1,
      components: [
        { label: "Cliquez ici pour remplir le petit sondage !", type: 2, style: 5, url: "https://forms.gle/NeszGEwfS92ZwJiU7" },
        { label: `Envoyer de ${guild.name || "ERROR"}`, type: 2, style: 2, disabled: true, custom_id: "blep" },
      ]
    }]
  })
}