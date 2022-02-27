const { Message } = require("discord.js")
const { sendLogs } = require("../../../functions/Sanction.js");

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!options[0]) return `${database.emojis.close.msg} ** ** **Je ne sais pas qui expulser !**`;
  let user = await (options[0] ? (typeof options[0] !== "string" ? options[0] : guild.members.select(options[0], { bot: true }) ) : author);
  if (!user || !guild.members.cache.get(user?.id)) return ({ content: `${database.emojis.close.msg} ** ** **Je ne sais pas quel personne expulsé !**`});
  if (!user.user) user = guild.members.cache.get(user.id)
  if (!user.kickable || user.id == author.id || (user.roles.cache.has("906539625571561523") && !memberPermission.has("ADMINISTRATOR"))) return ({ content: `${database.emojis.close.msg} ** ** **Je ne peux pas expulser cette personne !**`});
  try {
    const reason = (interaction instanceof Message ? options.slice(1).map(({ value }) => value).join(" ") : options[1]) || "Aucune raison.";
    // send message to user
    const msg = await user.send({
      embeds: [
        {
          color: guild.translate("color.sanction"),
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL({format: "png", size: 512 }) },
          description: `> **Vous avez été expulsé de** \`${guild.name}\`${typeof options[1] == "string" ? `\n**Raison:** ${reason}` : ""}\n** **`,
          footer: { text: `Cette sanction a été enregistrée dans la base de donnée.` },
          timestamp: new Date(),
        }
      ]
    }).catch(() => false);
    // kick member ;)
    const kick = await guild.members.kick(user.id, reason.slice(0,500));
    // check if kick is success
    if (!kick) return ({ content: `${database.emojis.close.msg} ** ** **Je n'ai pas réussi à l'expulser !**\n\`\`\`js\n${err.message}\`\`\``});
    // send logs
    sendLogs(user["user"], "kick", reason, author, guild, msg);
    // confirm kick
    return ({ content: `${database.emojis.check.msg} ** ** **${user.user.tag} a été expulsé !**`});
  } catch(err) {
    return ({ content: `${database.emojis.close.msg} ** ** **Je n'ai pas réussi à l'expulser !**\n\`\`\`js\n${err.message}\`\`\``});
  }
}

module.exports.config = {
  name: "kick",
  aliase: [],
  category: "moderation",
  defer: true,
  options: [
    { name: "user", description: "L'utilisateur à expulser.", type: 6, required: true },
    { name: "reason", description: "La raison de l'expulsion.", type: 3, required: false }
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