const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const MEANINGCLOUD_KEY = "07391ca3761fe8039d25725c4e453e25"

module.exports = {

  /**
   * create a function that check if a message is violent, haineux, racist, sexist, etc...
   * 
   * don't use API
   * 
   * @param {string} text - text to decrypt
   * 
   */
  IA: function IA(text) {
    return new Promise((resolve, reject) => {
      const url = 'https://api.meaningcloud.com/sentiment-2.1';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `key=${MEANINGCLOUD_KEY}&lang=fr&txt=${text}&doc=&url=&model=general&ofr=json`
      };
      fetch(url, options)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }
}