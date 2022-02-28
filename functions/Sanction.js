const sanctionChannel = "832164618956832799"
const { Message, User } = require("discord.js");
const validType = ["ban", "kick", "mute", "unmute", "warn", "oral", "all", "unban"];

function formatType(str){
  switch(str){
    case "ban": return "bannissement";
    case "kick": return "expulsion";
    case "mute": return "mute";
    case "unmute": return "démute";
    case "warn": return "avertissement";
    case "oral": return "avertissement oral";
    case "unban": return "débannissement";
    default: return str;
  }
}

const uuid = require("uuid");

function generateId(id){
  // generate 10 randoms v4 uuid in a array with Array.from
  const arr = Array.from({ length: 10 }, () => uuid.v4());
  return (arr[Math.floor(Math.random() * arr.length)]+String(Number(id)*1.1+(Date.now()%1000))).replace(/[^a-zA-Z0-9]/g, "");
}

module.exports = {
  generateId,
  generateSanctionList: async function(userId, author, interaction, msg, actualSanctionIndex, type = "all"){
    if (!(author instanceof User) || isNaN(actualSanctionIndex) || typeof userId !== "string") throw new Error("invalid arguments");
    if (!validType.includes(type)) type = "all";
    const { guild, member } = interaction;
    const data = database.users.get(userId);
    const user = client.users.cache.get(userId);
    if (!data || data.sanctions.length < 1 || !user) return ({ content: `${database.emojis.close.msg} ** ** \`${user.tag}\` **ne possède aucune sanction !**`});
    const sanction = data.sanctions.filter(sanction => (type !== "all" ? sanction.type === type : true))[(actualSanctionIndex%data.sanctions.length) > -1 ? (actualSanctionIndex%data.sanctions.length) || 0 : 0];
    if (!sanction) return ({ content: `${database.emojis.close.msg} ** ** \`${user.tag}\` **ne possède aucune sanction ${type!=="all"?"du type spécifié ":""}!**`});
    const mod = client.users.cache.get(sanction.authorId);
    return ({
      ephemeral: true,
      embeds: [
        {
          color: sanction.type == "unban" ? guild.translate("color.success") : guild.translate("color.sanction"),
          title: "Sanctions",
          author: { name: user.tag, icon_url: user.displayAvatarURL({format: "png", size: 512 }) },
          description: `> **Sanctions de** \`${user.tag}\` par \`${mod?.tag?mod.tag:sanction.authorId}\`\n\n**${actualSanctionIndex+1}/${data.sanctions.length}** - **${sanction.type}**\n**Raison:** \`\`\`\n${sanction.reason}\`\`\`\n** **`,
          fields: [
            {
              name: "** **",
              value: `**Identifiant :** \`${sanction.id}\`\n\n**Sanction effectuée le** <t:${Math.trunc(sanction.date/1000)}> ( <t:${Math.trunc(sanction.date/1000)}:R> )`,
              inline: false
            }
          ]
        }
      ],
      components: [
        {
          components: [
            {
              type: 'SELECT_MENU',
              customId: `SANCTION_SELECT_TYPE&index=${actualSanctionIndex}`,
              placeholder: 'Quel type souhaite-tu voir ?',
              options: [
                ...validType.filter((str) => str !== "all").map((str) => ({
                  label: formatType(str),
                  description: type == str ? "selecté" : "",
                  value: str
                })),
              ]
            }
          ], type: 'ACTION_ROW'
        },
        {
          // BUTTONS 
          components: [
            {
              disabled: data.sanctions.length > 1 ? false : true,
              emoji: "885157955241115698", label: "", style: 2, type: 2, custom_id: `SANCTION_UNDO&index=${actualSanctionIndex}&author=${member.id}&user=${user.id}&type=${type}`,
            },
            {
              disabled: data.sanctions.length > 1 ? false : true,
              emoji: "885157955459235870", label: "", style: 2, type: 2, custom_id: `SANCTION_REDO&index=${actualSanctionIndex}&author=${member.id}&user=${user.id}&type=${type}`
            },
            {
              disabled: false,
              emoji: "885157955182428220", label: "", style: 2, type: 2, custom_id: `SANCTION_SEARCH&author=${member.id}&user=${user.id}&type=${type}`,
            },
            {
              disabled: false,
              emoji: "885157955270488084", label: "", style: 2, type: 2, custom_id: `MSG_DELETE&index=${actualSanctionIndex}&user=${user.id}`
            },
          ],
          type: 1
        },
        {
          // BUTTONS 2
          components: [
            {
              disabled: member.permissions.has("ADMINISTRATOR") ? false : true,
              emoji: "884084000744939571", label: "", style: 2, type: 2, custom_id: `SANCTION_DELETE&author=${member.id}&id=${sanction.id}`,
            },
            {
              disabled: member.permissions.has("ADMINISTRATOR") ? false : true,
              emoji: "947909176624050257", label: "", style: 2, type: 2, custom_id: `SANCTION_EDIT&author=${member.id}&id=${sanction.id}`,
            },
            {
              disabled: member.permissions.has("ADMINISTRATOR") ? false : true,
              emoji: "947563563696922664", label: "", style: 2, type: 2, custom_id: `SANCTION_RAW&user=${member.id}&sanctionId=${sanction.id}`,
            }
          ],
          type: 1
        }
      ]
    })
  },
  sendLogs: async function(user, type, reason, author, guild, mp){
    if (!client.channels.cache.get(sanctionChannel)) return console.log("no sanction channel found");
    switch(type){
      case "kick": {
        user.ensureData();
        database.users.push(user.id, ({
          date: Date.now(),
          type: "kick",
          reason: reason,
          userId: user.id,
          authorId: author.id,
          guild: guild.id,
          mp: mp ? true : false,
          id: generateId(user.id)
        }), "sanctions")
        client.channels.cache.get(sanctionChannel)?.send({
          embeds: [
            {
              color: guild.translate("color.sanction"),
              author: { name: author.tag, icon_url: author.displayAvatarURL({format: "png", size: 512 }) },
              description: `> **${user.tag} a été expulsé du serveur.**\n${mp ? "Message privé envoyé avec succès." : ""}`,
              fields: [
                { name: "Raison", value: reason.slice(0,1000) || "Aucune raison.", inline: false},
                { name: "Expulsé par", value: `${author.tag} ( ${author.id} )`, inline: false }
              ],
              timestamp: new Date(),
              footer: { text: `Cette sanction a été enregistrée dans la base de donnée.` },
            }
          ]
        }).catch(console.error);
        break;
      };
      case "ban": {
        (user.user?user.user:user).ensureData();
        database.users.push(user.id, ({
          date: Date.now(),
          type: "ban",
          reason: reason,
          userId: user.id,
          authorId: author.id,
          guild: guild.id,
          mp: mp ? true : false,
          id: generateId(user.id)
        }), "sanctions")
        client.channels.cache.get(sanctionChannel)?.send({
          embeds: [
            {
              color: guild.translate("color.sanction"),
              author: { name: author.tag, icon_url: author.displayAvatarURL({format: "png", size: 512 }) },
              description: `> **${user.user?user.user.tag:user.tag} a été bannis du serveur.**\n${mp ? "Message privé envoyé avec succès." : ""}`,
              fields: [
                { name: "Raison", value: reason.slice(0,1000) || "Aucune raison.", inline: false},
                { name: "Banni par", value: `${author.tag} ( ${author.id} )`, inline: false }
              ],
              timestamp: new Date(),
              footer: { text: `Cette sanction a été enregistrée dans la base de donnée.` },
            }
          ]
        }).catch(console.error);
        break;
      };
      case "warn": {
        client.channels.cache.get(sanctionChannel)?.send({
          embeds: [
            {
              color: guild.translate("color.sanction"),
              author: { name: author.tag, icon_url: author.displayAvatarURL({format: "png", size: 512 }) },
              description: `> **${user.tag} a été averti(e).**\n${mp ? "Message privé envoyé avec succès." : ""}`,
              fields: [
                { name: "Raison", value: reason.slice(0,1000) || "Aucune raison.", inline: false},
                { name: "Averti(e) par", value: `${author.tag} ( ${author.id} )`, inline: false }
              ],
              timestamp: new Date(),
              footer: { text: `Cette sanction a été enregistrée dans la base de donnée.` },
            }
          ]
        }).catch(console.error);
        break;
      };
      case "oral": {
        client.channels.cache.get(sanctionChannel)?.send({
          embeds: [
            {
              color: guild.translate("color.sanction"),
              author: { name: author.tag, icon_url: author.displayAvatarURL({format: "png", size: 512 }) },
              description: `> **${user.tag} a été averti(e) oralement.**\n${mp ? "Message privé envoyé avec succès." : ""}`,
              fields: [
                { name: "Raison", value: reason.slice(0,1000) || "Aucune raison.", inline: false},
                { name: "Averti(e) oralement par", value: `${author.tag} ( ${author.id} )`, inline: false }
              ],
              timestamp: new Date(),
              footer: { text: `Cet avertissement n'est pas enregistré dans la base de donnée.` },
            }
          ]
        }).catch(console.error);
        break;
      };
    }
  }
}