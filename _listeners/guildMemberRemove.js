const Discord = require("discord.js");

function sendLogs(member, isKicked = false) {
  if (isKicked) {
    client.channels.cache.get(member.guild.getData().logs.guildMemberRemove.channel)
      .send(member.guild.translate(
        "logs.guildMemberRemove.kicked",
        member.user.tag, member.displayAvatarURL({ size: 512, format: "png", dynamic: true }),
        member.displayAvatarURL({ size: 1024, format: "png", dynamic: true }),
        Math.trunc(member.user.createdTimestamp/1000),
        Math.trunc(member.joinedTimestamp/1000),
        (member.user.bot ? database.emojis.check?.msg || "✅" : database.emojis.close?.msg || "❌"),
        member.id, new Date(),
        member.displayAvatarURL({ size: 4096, format: "png", dynamic: true }),
      )).catch(() => null);
  }
  else {
    client.channels.cache.get(member.guild.getData().logs.guildMemberRemove.channel)
      .send(member.guild.translate(
        "logs.guildMemberRemove.leave",
        member.user.tag, member.displayAvatarURL({ size: 512, format: "png", dynamic: true }),
        member.displayAvatarURL({ size: 1024, format: "png", dynamic: true }),
        Math.trunc(member.user.createdTimestamp/1000),
        Math.trunc(member.joinedTimestamp/1000),
        (member.user.bot ? database.emojis.check?.msg || "✅" : database.emojis.close?.msg || "❌"),
        member.id, new Date(),
        member.displayAvatarURL({ size: 4096, format: "png", dynamic: true }),
      )).catch(() => null);
  }
}

/**
 * 
 * @param { AnyChannel } member 
 */
module.exports = async function guildMemberRemove(member){
  if (!(member instanceof Discord.GuildMember)) return console.warn("guildMemberRemove: member is not a GuildMember");
  if (typeof member?.guild?.getData()?.logs?.guildMemberRemove?.channel !== "string" || member.guild.bans.cache.get(member.id)) return;
  if (member?.guild?.members.cache.get(client.user.id)?.permissions.has("VIEW_AUDIT_LOG")) {
    // auditLogs
    member?.guild.fetchAuditLogs({ type: "MEMBER_KICK", limit: 10 }).then((logs) => {
      sendLogs(member, logs?.entries?.some((e) => e.target.id === member.id));
    })
  } else {
    sendLogs(member);
  }
}