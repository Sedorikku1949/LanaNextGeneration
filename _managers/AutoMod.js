module.exports = class AutoMod {
  constructor(db){
    this.client = global["client"];
    this.database = db;
    this.badwords = require("../_storage/badword.json");
    this.inviteRegex = (/discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gi);
    this.censuredCharacters = ['&', '#', '@', 'x', 'X', '*', 'o', 'O', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  }

  censuredContent(lt){
    console.log(lt)
    let res = "";
    for (let i = 0; i < lt; i++) {
      res = res + (this.censuredCharacters[Math.floor(Math.random() * this.censuredCharacters.length)]);
    }
    return res;
  }

  invites(content){
    if (typeof content !== "string") return false;
    return (this.inviteRegex).test(content);
  }

  badword(content){
    if (typeof content !== "string") return false;
    return this.badwords.some(word => content.toLowerCase().includes(word));
  }

  testAll(content){
    if (typeof content !== "string") return false;
    return this.badword(content) || this.invites(content);
  }

  replaceAll(content){
    if (typeof content !== "string") return false;
    if (!this.testAll(content)) return content;
    return content.toLowerCase()
      .replace(new RegExp("\\s+"+(this.badwords.map((e) => e.replace(/\|/g, "")).join("|\\s+")), "gi"), (a,_) => { console.log(a); return (a.startsWith(" ") ? " " : "")+this.censuredContent(a.length || 5)+(a.endsWith(" ") ? " " : "") })
      .replace(this.inviteRegex, (a,_) => this.censuredContent(a.length || 5))
      .replace(/\*|\@|\#/, (a,_) => `\\${a}`);
  }
}