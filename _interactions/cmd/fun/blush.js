module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  const url = guild.translate("misc.gifs.list.blush").random() || guild.translate("misc.gifs.list.blush")[0];
  return guild.translate("misc.gifs.res.blush", url, member.displayName ?? "ERROR");
}

module.exports.config = {
  name: "blush",
  aliase: ["rougis"],
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