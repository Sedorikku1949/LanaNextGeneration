const Discord = require("discord.js");

function position(nb){
  switch(typeof nb == "string" ? Number(nb) : nb){
    case 0: return `${nb}er`;
    default: return `${nb}e`;
  }
}

function sendLogs(rl, audit = null) {
  let data = { content: "ERROR" };
  if ((audit instanceof Discord.GuildAuditLogsEntry) && audit?.action == "ROLE_CREATE") {
    data = rl?.guild?.translate(
      "logs.roleCreate.audits",
      audit.executor.displayAvatarURL({ size: 512, dynamic: true, format: "png" }) || "https://cdn.discordapp.com/embed/avatars/5.png", audit.executor.tag,
      rl.name, rl.id, Math.trunc(audit.createdTimestamp/1000) || "NaN",
      audit.reason || "Aucune raison précisée. ( bot uniquement )", client.user.displayAvatarURL({ size: 512, format: "png" }), position(rl.guild.roles.cache.size - rl.position)
    )
  } else {
    data = rl?.guild?.translate(
      "logs.roleCreate.default",
      rl.toString(), rl.name, rl.id, Math.trunc(Date.now()/1000) || "NaN", rl.type,
      client.user.displayAvatarURL({ size: 512, format: "png" }),  position(rl.guild.roles.cache.size - rl.position)
    )
  }
  client.channels.cache.get(rl?.guild?.getData()?.logs?.roleCreate?.channel)?.send(data).catch((err) => console.log(err))
}

/**
 * 
 * @param { AnyRole } rl 
 */
module.exports = async function roleCreate(rl){
  rl?.guild?.ensureData();
  if (!rl?.guild?.getData || typeof rl?.guild?.getData()?.logs?.roleCreate?.channel !== "string") return;
  if (rl?.guild?.members.cache.get(client.user.id)?.permissions.has("VIEW_AUDIT_LOG")) {
    // auditLogs
    rl?.guild.fetchAuditLogs({ type: "ROLE_CREATE", limit: 10 }).then((logs) => {
      sendLogs(rl, logs?.entries?.find((e) => e.target.id === rl.id));
    })
  } else {
    sendLogs(rl);
  }
}