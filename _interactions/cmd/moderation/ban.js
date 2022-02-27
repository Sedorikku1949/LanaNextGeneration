const { Message, GuildMember, User } = require("discord.js")
const { sendLogs } = require("../../../functions/Sanction.js");

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!options[0]) return `${database.emojis.close.msg} ** ** **Je ne sais pas qui bannir !**`;
  let user = await (options[0] ? (typeof options[0] !== "string" ? options[0] : guild.members.select(options[0], { bot: true }) ) : author);
  if (!user || ![User, GuildMember].some((c) => user instanceof c)) return ({ content: `${database.emojis.close.msg} ** ** **Je ne sais pas quel personne bannir !**`});
  if (((user instanceof GuildMember) && !user.bannable) || user.id == author.id || ((user instanceof GuildMember) && user.roles.cache.has("906539625571561523") && !memberPermission.has("ADMINISTRATOR"))) return ({ content: `${database.emojis.close.msg} ** ** **Je ne peux pas bannir cette personne !**`});
  try {
    const reason = (interaction instanceof Message ? options.slice(1).map(({ value }) => value).join(" ") : options[1]) || "Aucune raison.";
    // send message to user
    const msg = await user.send({
      embeds: [
        {
          color: guild.translate("color.sanction"),
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL({format: "png", size: 512 }) },
          description: `> **Vous avez été bannis de** \`${guild.name}\`${typeof options[1] == "string" ? `\n**Raison:** ${reason}` : ""}\n** **`,
          footer: { text: `Vous devrez être débannis pour pouvoir rejoindre le serveur.` },
          timestamp: new Date(),
        }
      ]
    }).catch(() => false);
    // ban member ;)
    const ban = await guild.members.ban(user.id, { reason: reason.slice(0,500), days: 7 });
    // check if ban is success
    if (!ban) return ({ content: `${database.emojis.close.msg} ** ** **Je n'ai pas réussi à le bannir !**\n\`\`\`js\n${err.message}\`\`\``});
    // send logs
    sendLogs(user, "ban", reason, author, guild, msg);
    // confirm ban
    return ({ content: `${database.emojis.check.msg} ** ** **${user.user?user.user.tag:user.tag} a été bannis !**`});
  } catch(err) {
    return ({ content: `${database.emojis.close.msg} ** ** **Je n'ai pas réussi à le bannir !**\n\`\`\`js\n${err.message}\`\`\``});
  }
}

module.exports.config = {
  name: "ban",
  aliase: ["getout"],
  category: "moderation",
  defer: true,
  options: [
    { name: "user", description: "L'utilisateur à bannir.", type: 6, required: true },
    { name: "reason", description: "La raison du bannissement.", type: 3, required: false }
  ],
  system: {
    requiredPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    userPermission: [],
    staff: true,
    dev: false,
    inProgress: false,
    isUserCommand: false,
    isSlashCommand: true
  },
  lang: null,
  path: null
}