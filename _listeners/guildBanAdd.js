const Discord = require("discord.js");

function sendLogs(data, ban, audit = null) {
  if (audit) {
    client.channels.cache.get(ban.guild.getData().logs.guildBanAdd.channel)
      .send(ban.guild.translate(
        "logs.guildBanAdd.audit",
        ban.user.tag, ban.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 }),
        ban.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }),
        new Date(), (ban.reason || ban.guild.translate("logs.guildBanAdd.noReason")),
        audit.executor.tag, audit.executor.id,
        ban.user.id, Math.trunc(ban.user.createdTimestamp/1000),
        (ban.user.bot ? database.emojis.check?.msg || "✅" : database.emojis.close?.msg || "❌"),
      )).catch(() => null);
  }
  else {
    client.channels.cache.get(ban.guild.getData().logs.guildBanAdd.channel)
      .send(ban.guild.translate(
        "logs.guildBanAdd.default",
        ban.user.tag, ban.user.displayAvatarURL({ dynamic: true, format: "png", size: 512 }),
        ban.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }),
        new Date(), (ban.reason || ban.guild.translate("logs.guildBanAdd.noReason")),
        ban.user.id, Math.trunc(ban.user.createdTimestamp/1000),
        (ban.user.bot ? database.emojis.check?.msg || "✅" : database.emojis.close?.msg || "❌"),
      )).catch(() => null);
  }
}

/**
 * 
 * @param { AnyChannel } ban 
 */
module.exports = async function guildBanAdd(ban){
  if (!(ban instanceof Discord.GuildBan)) return;
  const data = await ban.fetch().catch(() => null);
  if (!data || typeof ban.guild.getData().logs?.guildBanAdd?.channel !== "string") return;
  if (ban?.guild?.bans.cache.get(client.user.id)?.permissions.has("VIEW_AUDIT_LOG")) {
    // auditLogs
    ban?.guild.fetchAuditLogs({ type: "GUILD_BAN", limit: 10 }).then((logs) => {
      sendLogs(data, ban, logs?.entries?.find((e) => e.target.id === ban.user.id));
    })
  } else {
    sendLogs(data, ban);
  }
}