module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  const url = guild.translate("misc.gifs.list.punch").random() || guild.translate("misc.gifs.list.punch")[0];
  if (!options[0]) return guild.translate("misc.gifs.res.punch.default", url, member.displayName);
  const user = typeof options[0] == "string" ? guild.members.select(options[0].startsWith("<@") ? options[0].replace(/[^0-9]/g, "") : options[0], { user: true, bot: true }) : null;
  if (!user || !user?.username) return guild.translate("misc.gifs.res.punch.default", url, member.displayName ?? "ERROR");
  else return guild.translate("misc.gifs.res.punch.user", url, member.displayName ?? "ERROR", user.username ?? "ERROR");
}

module.exports.config = {
  name: "punch",
  aliase: [],
  category: "gifs",
  defer: false,
  options: [],
  system: {
    requiredPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPermission: [],
    staff: false,
    dev: false,
    inProgress: false,
    isUserCommand: false,
    isSlashCommand: false
  },
  lang: null,
  path: null
}