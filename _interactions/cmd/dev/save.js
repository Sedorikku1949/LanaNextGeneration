let cooldown = false;
module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!database.config.dev.evalAccess) return { content: "<:close:884084000744939571> ** ** **Cette commande est réservée aux développeurs !", ephemeral: true }
  if (cooldown) return { content: "<:close:884084000744939571> ** ** **Veuillez attendre avant d'utiliser cette commande !", ephemeral: true }
  cooldown = true;
  const msg = await channel.send("> ** ** **Sauvegarde en cours...**");
  database._save(client).then((res) => {
    cooldown = false;
    msg.edit("> ** ** **Sauvegarde terminée !**");
  });
}

module.exports.config = {
  name: "save",
  aliase: [],
  category: "dev",
  defer: false,
  options: [],
  system: {
    requiredPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPermission: [],
    staff: false,
    dev: true,
    inProgress: false,
    isUserCommand: false,
    isSlashCommand: false
  },
  lang: null,
  path: null
}