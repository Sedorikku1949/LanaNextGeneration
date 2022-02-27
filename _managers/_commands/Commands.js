const { readdirSync } = require("fs")
const { color } = require("../../functions/Utils.js")

class Commands extends Map {
  constructor(path = "_interactions/cmd"){
    super()
    const that = this;
    // folder scan
    function getAllCommands(dir){
      readdirSync(dir).forEach((subdir) => {
        if (!subdir.match(/\./g)) getAllCommands(`${dir}/${subdir}`)
        else if (subdir.endsWith(".js") && !subdir.startsWith(".")) {
          let cmd = require(`../../${dir}/${subdir}`);
          if (!cmd) return;
          cmd.config.path = `${dir}/${subdir}`;
          cmd.exec.bind(cmd);
          that.set(cmd.config.name, cmd)
        } else console.log(color(`{yellow}{ WARNING } >> The file ${subdir} as been ignored.`))
      })
    };
    getAllCommands(path);
    console.log(color(`{cyan}{ COMMANDS } >> ${this.size} commands has been loaded !`))
  };

  array(){
    let res = [];
    this.forEach((that) => res.push(that));
    return res;
  };
  find(callback){  return this.array().find(callback) };
}

module.exports = Commands;