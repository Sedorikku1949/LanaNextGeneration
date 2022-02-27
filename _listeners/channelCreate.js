const Discord = require("discord.js");

function sendLogs(chl, audit = null) {
  let data = { content: "ERROR" };
  if ((audit instanceof Discord.GuildAuditLogsEntry) && audit?.action == "CHANNEL_CREATE") {
    data = chl?.guild?.translate(
      "logs.channelCreate.audits",
      audit.executor.displayAvatarURL({ size: 512, dynamic: true, format: "png" }) || "https://cdn.discordapp.com/embed/avatars/5.png", audit.executor.tag,
      chl.name, chl.id, Math.trunc(audit.createdTimestamp/1000) || "NaN",
      audit.reason || "Aucune raison précisée. ( bot uniquement )", client.user.displayAvatarURL({ size: 512, format: "png" }),
      chl.type.toLowerCase().replace(/[^a-zA-Z]|guild/g, " ").trim()
    )
  } else {
    data = chl?.guild?.translate(
      "logs.channelCreate.default",
      chl.toString(), chl.name, chl.id, Math.trunc(Date.now()/1000) || "NaN",
      chl.type.toLowerCase().replace(/[^a-zA-Z]|guild/g, " ").trim(),
      client.user.displayAvatarURL({ size: 512, format: "png" })
    )
  }
  client.channels.cache.get(chl?.guild?.getData()?.logs?.channelCreate?.channel)?.send(data).catch((err) => console.log(err))
}

/**
 * 
 * @param { AnyChannel } chl 
 */
module.exports = async function channelCreate(chl){
  chl?.guild?.ensureData();
  if (!chl?.guild?.getData || typeof chl?.guild?.getData()?.logs?.channelCreate?.channel !== "string") return;
  if (chl?.guild?.members.cache.get(client.user.id)?.permissions.has("VIEW_AUDIT_LOG")) {
    // auditLogs
    chl?.guild.fetchAuditLogs({ type: 10, limit: 10 }).then((logs) => {
      sendLogs(chl, logs?.entries?.find((e) => e.target.id === chl.id));
    })
  } else {
    sendLogs(chl);
  }
}