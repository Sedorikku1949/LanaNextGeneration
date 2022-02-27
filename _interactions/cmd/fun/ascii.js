const Discord = require("discord.js");
const { ASCII } = require("../../../functions/Utils.js");

const colorsAvailable = {
  red: { prefix: "- ", name: "diff" },
  green: { prefix: '= ', name: "fix" },
  blue: { prefix: "# ", name: "md" },
  orange: { prefix: "# ", name: "glsl" },
  grey: { prefix: "# ", name: "py" },
  tex: { prefix: "", name: "tex" }
}

/**
 * @param { String } str 
 * 
 * max character length per line : 20
 * 
 * @return { String } Ascii Text
 */
function formatAsciiText(str, color){
  if (typeof str !== "string") return ASCII("ERROR").join("\n");
  else {
    let colorPrefix = "";
    let colorName = "";
    if (color && colorsAvailable[color]) { colorPrefix = colorsAvailable[color].prefix; colorName = colorsAvailable[color].name; }
    if (str.length < 21) return ("```"+colorName+`\n${colorPrefix}`+(ASCII(str).join(`\n${colorPrefix}`))+"```").replace(/_/g, "\_");
    else {
      const arr = str.split("").splitArray(20);
      return ("```"+colorName+`\n${colorPrefix}`+(arr.map((t) => ASCII(t.join("")).join(`\n${colorPrefix}`)).join(""))+"```").replace(/_/g, "\_");
    }
  }
}

module.exports.exec = async function(author, channel, guild, memberPermission, member, interaction, options){
  if (!options[0]) return guild.translate("commands.ascii.assets.noArgs");
  if (interaction instanceof Discord.CommandInteraction) {
    // SlasgCommand >> colors available
    const args = options.toSource();
    const color = args.find(({ name }) => name == "color")?.value;
    console.log(color);
    const asc = formatAsciiText((args.find(({ name }) => name == "text")?.value ?? "ERROR"), color)
    return { content: asc }
  } else {
    // classique commande >> no color
    const asc = formatAsciiText(options.join(" "), null)
    return { content: asc }
  }
}

module.exports.config = {
  name: "ascii",
  aliase: [],
  category: "fun",
  defer: false,
  options: [
    { name: "text", required: true, description: "Le texte à transformer.", type: 3 },
    { name: "color", required: false, description: "La couleur du texte souhaitée - Visible sur ordinateur uniquement.", type: 3 },
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