const { Client, Intents } = require("discord.js");
const { readdirSync } = require("fs");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Pwd {
  constructor(pwd) {
    if (btoa(pwd) !== "dGxrb2UuRWRlbg==") throw new Error("INVALID PASSWORD WAS PROVIDED");
      else return require("../_storage/config.json");
  }
}

Pwd.prototype.toString = () => "NOPE";

class Kady {
  constructor() {
    this._loadClient(false);
    this._loadDatabase(false);
    this._loadRessources(false);
    this._loadEvents(false);
    this._login(false);

    this["@config"] = (pwd) => new Pwd(pwd);
  }

  _loadEvents(reload = false) {
    if (reload && (global["client"] instanceof Client)) {
      Object.entries(client._events).filter(e => !["shardDisconnect", "guildMembersChunk"].includes(e[0])).forEach((ev) => {
        delete global["client"]._events[ev[0]];
        delete require.cache[require.resolve(`../_listeners/${ev[0]}.js`)];
      })
    }
    let i = 0;
    readdirSync("_listeners").forEach((dir) => {
      const e = require(`../_listeners/${dir}`);
      if (typeof e !== "function") return console.log(`[33m{ WARNING } The file "${dir}" has been ignored when loading events.[0m`);
      try { client.on(dir.replace(/\.js/g, ""), e); i++ }
        catch(err) { console.log(err) }
    })
    console.log(`[32m{ EVENTS } ${i} events has been loaded successfully[0m`)
  }

  _loadRessources(reload = false) {
    if (global["database"] && reload) {
      require("./Prototype.js").list.forEach((name) => eval(`name = () => null`));
      delete global["database"].CommandsManager; delete global["database"].InteractionManager;
      delete require.cache[require.resolve("./Prototype.js")];
      delete require.cache[require.resolve("./_commands/CommandsManager.js")];
      delete require.cache[require.resolve("./_interactions/InteractionManager.js")];
    }
    this.Prototype = require("./Prototype.js");
    this.Prototype.exec();
    this.CommandsManager = new (require("./_commands/CommandsManager.js"))();
    this.InteractionManager = new (require("./_interactions/InteractionManager.js"))();
  }

  _loadDatabase(reload = false) {
    if (reload) global["database"].reload()
      else global["database"] = new (require("./Database.js"))();

    global["database"].Client = this;
  }

  _loadClient() {
    this.Client = new Client({
      intents: Object.keys(Intents.FLAGS),
      partials: ["CHANNEL"],
      fetchAllMembers: true,
      allowedMentions: { repliedUser: false },
      retryLimit: 5,
      invalidRequestWarningInterval: 10
    });

    global["client"] = this.Client;
  };

  _login() {
    delete require.cache[require.resolve("../_storage/config.json")];
    this.Client.login(require("../_storage/config.json").token);
  }

  async reloadAll() {
    delete global["client"]
    this.Client._events = {};
    this.Client.destroy();
    await wait(3000);
    this.Client.destroy()
    this._loadClient(true);
    this._loadDatabase(true);
    this._loadRessources(true);
    this._loadEvents(true);
    this._login(true);
  }
}


module.exports = new Kady();