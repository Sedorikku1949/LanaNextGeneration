module.exports = {
  getPixels: (file) => new Promise(function (resolve, rejected) { require('get-pixels')(file, (err, arr)=>err?rejected(err):resolve(arr)) })
}