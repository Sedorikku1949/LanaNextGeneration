const Discord = require("discord.js");

function sendLogs(chl, audit = null) {
  let data = { content: "ERROR" };
  if ((audit instanceof Discord.GuildAuditLogsEntry) && audit?.action == "CHANNEL_DELETE") {
    data = chl?.guild?.translate(
      "logs.channelDelete.audits",
      audit.executor.displayAvatarURL({ size: 512, dynamic: true, format: "png" }) || "https://cdn.discordapp.com/embed/avatars/5.png", audit.executor.tag,
      chl.name, chl.id, Math.trunc(audit.createdTimestamp/1000) || "NaN",
      audit.reason || "Aucune raison précisée. ( bot uniquement )", client.user.displayAvatarURL({ size: 512, format: "png" }),
      chl.type.toLowerCase().replace(/[^a-zA-Z]|guild/g, " ").trim()
    )
  } else {
    data = chl?.guild?.translate(
      "logs.channelDelete.default",
      chl.name, chl.name, chl.id, Math.trunc(Date.now()/1000) || "NaN",
      chl.type.toLowerCase().replace(/[^a-zA-Z]|guild/g, " ").trim(),
      client.user.displayAvatarURL({ size: 512, format: "png" })
    )
  }
  client.channels.cache.get(chl?.guild?.getData()?.logs?.channelDelete?.channel)?.send(data).catch((err) => console.log(err))
}

/**
 * @param { AnyChannel } chl 
 */
module.exports = async function channelDelete(chl){
  chl?.guild?.ensureData();
  if (!chl?.guild?.getData || typeof chl?.guild?.getData()?.logs?.channelDelete?.channel !== "string") return;
  if (chl?.guild?.members.cache.get(client.user.id)?.permissions.has("VIEW_AUDIT_LOG")) {
    // auditLogs
    chl?.guild.fetchAuditLogs({ type: "CHANNEL_DELETE", limit: 10 }).then((logs) => {
      sendLogs(chl, logs?.entries?.find((e) => e.target.id === chl.id));
    })
  } else {
    sendLogs(chl);
  }
}