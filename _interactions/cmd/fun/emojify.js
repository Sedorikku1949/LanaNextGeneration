const list = { a: '🇦', b: '🇧', c: '🇨', d: '🇩', e: '🇪', f: '🇫', g: '🇬', h: '🇭', i: '🇮', j: '🇯', k: '🇰', l: '🇱', m: '🇲', n: '🇳', o: '🇴', p: '🇵', q: '🇶', r: '🇷', s: '🇸', t: '🇹', u: '🇺', v: '🇻', w: '🇼', x: '🇽', y: '🇾', z: '🇿', "0": '0️⃣', "1": '1️⃣', "2": '2️⃣', "3": '3️⃣', "4": '4️⃣', "5": '5️⃣', "6": '6️⃣', "7": '7️⃣', "8": '8️⃣', "9": '9️⃣', "10": '🔟', '#': '#️⃣', '*': '*️⃣', '!': '❗', '?': '❓', " ": "ㅤ" };
module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  return options[0] ? options.join(" ").toLowerCase().replace(/[^a-z-A-Z0-9|^\s]/g, "").split("").map(x => list[x]).join("\u200b") : guild.translate("commands.emojify.assets.noArgs");
}

module.exports.config = {
  name: "emojify",
  aliase: [],
  category: "fun",
  defer: false,
  options: [
    { name: "texte", required: true, description: "Le texte à transformer", type: 3 }
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