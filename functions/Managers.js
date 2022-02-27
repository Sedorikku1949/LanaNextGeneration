const Discord = require('discord.js');

module.exports = {
  getArgs: function getArgs(object, prefix){
    const type = { SUB_COMMAND: 1, SUB_COMMAND_GROUP: 2, STRING: 3, INTEGER: 4, BOOLEAN: 5, USER: 6, CHANNEL: 7, ROLE: 8, MENTIONNANLE: 9, NUMBER: 10 };
    const methods = {
      join: function(j){ return this.map(t=>t.value).join(j[0]) },
      getName: function(n, all = false){ return all ? this.filter(t => t.name ===n ) : this.find( t=> t.name === n ) },
      getType: function(n, all = false){ return all ? this.filter(t => t.type ===n ) : this.find( t=> t.type === n ) },
      toSource: function(){ return this },
      slice: function(nb){ return this.slice(nb) }
    }
    const handler = {
      get:function(target, name){
        if (Object.keys(methods).includes(name)) return (...args)=> { return methods[name].bind(target,args)() };
        if (!isNaN(name)) return target[name]?.value;
        if (name === "length") return target.length;
        if (name === "cmd") return object?.content?.slice(prefix)?.trim()?.split(/\s+/g)?.shift();
      }
    }
    let data
    if(object?.options?.data?.find(t=>t?.type=="SUB_COMMAND")){
      const sub = object.options.data.find((t) => t.type == "SUB_COMMAND")
      data = sub.options ?? []
    } else data = object?.options?.data
    const arguments = object instanceof Discord.Message ? (object.content.slice(prefix).trim().split(/\s+/g).slice(1).map((t) => ({ value:t, name:undefined, type:undefined }) )) : object instanceof Discord.CommandInteraction? (data.map(t=>{ t.type = type[t.type] ?? t.type; return t })):undefined
    return arguments === undefined ? []:new Proxy(arguments, handler)
  }
}