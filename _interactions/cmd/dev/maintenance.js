module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!database.config.dev.evalAccess) return { content: "<:close:884084000744939571> ** ** **Cette commande est réservée aux développeurs !", ephemeral: true }
  
  if (database.system.get("maintenance")) {
    database.system.set("maintenance", false)
    channel.send("> ** ** **La maintenance est désactivée !**")
    client.user.setActivity("👋 Fin de la maintenance", { type: "WATCHING" });
    return void 1;
  } else {
    database.system.set("maintenance", true)
    channel.send("> ** ** **La maintenance est activée !**")
    client.user.setActivity(client.user.id == "858766319506554899" ? "🚧 Maintenance in progress" : "⚙️ Test des développeurs en cours...", { type: "WATCHING" });
    return void 1;
  }
}

module.exports.config = {
  name: "maintenance",
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