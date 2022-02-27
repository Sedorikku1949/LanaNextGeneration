const { User, GuildMember, Guild, GuildMemberManager } = require("discord.js")

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  let user = (options[0] ? await (typeof options[0] !== "string" ? options[0] : guild.members.select(options[0], { fetch: true, bot: true }) ) : member);
  if (!user && options[0]) return ":x: ** ** **Je ne sais pas quelle personne cherchée !**"
  if (!user) return ":x: ** ** **Une erreur est survenue !**"
  if (guild.members.cache.get(user.id)) user = guild.members.cache.get(user.id)
  const averageColor = await (user.displayAvatarURL({size: 256,format:"png"})).averageColor("hex") ?? guild.translate("color.secondary")
  let components = [{ label: "Avatar", type: 2, style: 3, custom_id: `AVATAR&id=${user.id}` }];
  if (user instanceof GuildMember) components.push({ label: "Membre du serveur", disabled: true, style: 2, type: 2, custom_id: `MEMBER&id=${user.id}` })
  const banned = await guild.bans.fetch(user.id).catch(() => false)
  return ({
    embeds: [
      {
        color: averageColor,
        author: { name: (user.tag?user.tag:user.user.tag), icon_url: (user instanceof User ? user : user.user).displayAvatarURL({format: "png", size: 4096, dynamic: true}) },
        footer: { icon_url: client.user.displayAvatarURL({ size: 512, format: "png" }), text: client.user.tag },
        thumbnail: { url: user.displayAvatarURL({format: "png", size: 4096, dynamic: true }) },
        description: `> **・Pseudonyme:** \`${user.tag?user.tag:user.user.tag}\`\n> **・ID:** \`${user.id}\`\n\n${(user instanceof GuildMember) ? `> **・Surnom:** \`${user.nickname ? user.nickname : "Aucun surnom."}\`\n> **・Rôles:** ${user.roles.cache.size}\n\n` : "" }> ・**Créé le:** <t:${Math.trunc((user.createdTimestamp?user.createdTimestamp:user.user.createdTimestamp)/1000)}> ( il y a <t:${Math.trunc((user.createdTimestamp?user.createdTimestamp:user.user.createdTimestamp)/1000)}:R> )\n${(user instanceof GuildMember) ? `> ・**As rejoint le:** <t:${Math.trunc(user.joinedTimestamp/1000)}> ( il y a <t:${Math.trunc(user.joinedTimestamp/1000)}:R> )` : ""}\n${user instanceof User ? `> ・**Bannis:** ${banned ? database.emojis.check.msg : database.emojis.close.msg}` : ""}\n> ・**Bot:** ${(user.user?user.user.bot:user.bot) ? database.emojis.check.msg : database.emojis.close.msg}`
      }
    ],
    components: [
      {
        type: 1,
        components: components
      },
    ],
  })
}

module.exports.config = {
  name: "userinfo",
  aliase: ["user", "ui"],
  category: "user",
  defer: true,
  options: [
    { name: "user", description: "L'utilisateur dont vous souhaitez avoir les informations.", type: 6, required: false }
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