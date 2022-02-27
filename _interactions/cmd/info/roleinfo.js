module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!options[0]) return guild.translate("commands.roleinfo.assets.noRole");
  const role = typeof options[0] == "object" && options[0].type == 8 ? options[0].role : guild.roles.select(options[0]);
  if (!role) return guild.translate("commands.roleinfo.assets.noRole");
  const type = typeof options[0] == "object" && options[0].type == 8
  const { check, close } = database.emojis
  const members = await guild.members.fetch();
  return guild.translate(
    "commands.roleinfo.assets.response",
    role.id, (role.hexColor == "#000000" ? "#36393f" : role.hexColor), role.iconURL(), role.mentionnable ? ( type ? "✅" : check.msg) : ( type ? "❌" : close.msg), guild.roles.cache.size - role.rawPosition,
    role.tags ?? guild.translate("commands.roleinfo.misc.noTags"), role.permissions.bitfield, role.managed ? ( type ? "✅" : check.msg) : ( type ? "❌" : close.msg),
    members.filter(m => m.roles.cache.has(role.id)).size,
  );
}

module.exports.config = {
  name: "roleinfo",
  aliase: ["role"],
  category: "info",
  defer: false,
  options: [
    { name: "role", description: "Le rôle que tu cherche", type: 8, required: true }
  ],
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