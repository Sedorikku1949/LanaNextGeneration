const list = [
  "💖 The Last Kingdom Of Eden",
  "📦 version {version}",
  "🔧 {prefix}help",
  "📅 {day}",
  "🎮 {randomUser}",
  "since 2018 💕",
  "joue avec Maggot et Kady",
];

const dayjs = require("dayjs");

function formatState(str) {
  return str.replace(/{(?:[a-zA-Z0-9]+)}/g, (m, _) => {
    switch(m) {
      case "{users}": return String((client.guilds.cache.reduce((a,b) => a += b.memberCount, 0)).shortNumber()) ?? "0";
      case "{day}": return (dayjs(new Date())).format("DD/MM/YYYY") ?? "01/01/1970";
      case "{version}": return ((client.user.id == "858766319506554899" ? require("../package.json").version : false) ?? "0.0.1 BETA");
      case "{prefix}": return((client.user.id == "858766319506554899" ? client.prefix : "=") ?? ".");
      case "{randomUser}": return client.users.cache.random().tag ?? "Sedorriku#0001";
    }
  })
}

async function stateUpdate(ms, i = 0) {
  if (isNaN(ms)) ms = 120000;
  if (isNaN(i)) i = 0;
  if (global["client"].autoState == true) {
    try {
      if (!database.system.get("maintenance") && client.user.id !== "806438484159102996") client.user.setActivity(formatState(list[Math.abs(i%(list.length))]) ?? "#KadyForEver", { type: "WATCHING" });
      else client.user.setActivity(client.user.id == "858766319506554899" ? "🚧 Maintenance in progress" : "⚙️ Test des développeurs en cours...", { type: "WATCHING" });
      setTimeout(async() => stateUpdate(ms, (i%list.length)+1), ms);
    } catch(err) {
      console.warn(`\u001b[31m[ AUTO STATE INTERVAL ] fail to change state with error\n${err?.message}\u001b[0m`);
      setTimeout(async() => stateUpdate(ms, (i%list.length)+1), ms);
    };
  } else setTimeout(async() => stateUpdate(ms, i), ms);
}

module.exports = async function() {
  console.log("[ \x1b[32mClient\x1b[0m ] Client ready");
  client.prefix = (client?.user?.id == "858766319506554899" ? "=" : ".");
  
  if (!database.guilds.get("831842750538186772")) database.guilds.set("831842750538186772", require("../guild.js")(client.guilds.cache.get("831842750538186772")));
  if (!database.guilds.get("848657031694778378")) database.guilds.set("848657031694778378", require("../guild.js")(client.guilds.cache.get("848657031694778378")));
  
  if (global["reload"]) {
    global["client"]?.channels?.cache?.get(global["reload"].channel)?.messages?.fetch(global["reload"].msg)?.then((m) => m.edit("> <:check:884084000291971084> ** ** **Rechargement réussi !**"))
    delete global["reload"];
  }

  // state update interval
  global["client"].autoState = true;
  stateUpdate(300000); // interval of 5m

  // system interval
  database.system.ensure("saveDate", Date.now() - (24*60*60*1000));
  setInterval(() => {
    if (database.system.get("saveDate") - Date.now() < 0) {
      database.system.set("saveDate", Date.now() + (24*60*60*1000));
      database._save(global["client"], true);
    }
  }, 5000)

  // slash commands
  Promise.all(client.guilds.cache.map(guild => guild.commands.fetch().catch(() => false) && guild.members.fetch().catch(() => false)))
  database.SlashCommands = new (require("../_managers/_commands/SlashCommands.js"))(client, database.commands);

  // emojis
  client.guilds.cache.forEach(guild => database.SlashCommands.loadGuild(guild));
  database.emojis = {};
  client.guilds.cache.get("855448055149887538").emojis.cache.forEach((emj) => {
    database.emojis[emj.name.replace(/[^a-zA-Z]/g, "")] = {
      msg: emj.toString(),
      id: emj.id,
      name: emj.name
    };
  });

  // console eval
  process.stdin.resume();
  process.stdin.on("data", function(data){
      data = data.toString().trim()
      if (data.length == "\n") return process.stdout.write("> ");
      if (data === ".clear") { console.clear(); return process.stdout.write("> "); }
      let send;
      try {
          console.log(`[ \x1b[1;32meval\x1b[0m ]: ${require("util").inspect(eval(data), {colors:true, depth:0})}`);
      } catch(err) {
          console.log(`[ \x1b[1;32meval\x1b[0m ]: \x1b[1;31m<ERROR> ${err}\x1b[0m`);
      }
      process.stdout.write("> ");
  });
}
