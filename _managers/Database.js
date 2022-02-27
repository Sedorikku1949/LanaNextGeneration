const Enmap = require("enmap")
const { writeFileSync } = require("fs")

class Database {
  constructor(){
    this.config = require("../_storage/_config/config.json");
    this.commands = (new (require("./_commands/Commands.js"))());
    this.cooldown = { xp: {}, command: {} };
    this.users = new Enmap({ dataDir: "_storage/_database/users", name: "users" });
    this.system = new Enmap({ dataDir: "_storage/_database/_system", name: "system" });
    this.guilds = new Enmap({ dataDir: "_storage/_database/guilds", name: "guilds" });
    this.Interactions = new (require("./_interactions/Interaction.js"))();
    this.Language = require("./Language.js");
    this.AutoMod = new (require("./AutoMod.js"))(this);
  }

  reload(){
    return false;
  }

  _getObjectData(key){
    if (typeof key !== "string" || !(this[key] instanceof Enmap)) return null;
    const k = {};
    Array.from(this[key]).forEach((arr) => k[arr[0]] = arr[1]);
    return k;
  }


  async _save(Client, auto = false){
    return new Promise((resolve, reject) => {
      const data = { system: this._getObjectData("system"), users: this._getObjectData("users"), guilds: this._getObjectData("guilds") };
      const path = "database_"+((require("dayjs"))(new Date()).format("DD-MM-YYYY_HH-m-ss-ms"))+".json";
      writeFileSync(`_storage/_save/${path}`, JSON.stringify(data));
      Client?.channels?.cache.get("907371824923414548")?.send(`> ${auto ? "** ** [ AUTO DAILY SAVE ] ** **" : "** ** [ MANUAL ] ** **" } **Database saved successfully at** \`_storage/_save/${path}\``).catch(() => false);
      resolve(true);
    })
  }
};

module.exports = Database;