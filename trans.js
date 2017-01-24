const exports = module.exports = {};

const request = require('request');
const TRANS_BASE = 'https://translator.microsoft.com';
const TRANS_URL = 'https://translator.microsoft.com/neural';
const TRANS_API_URL = 'https://translator.microsoft.com/neural/api/translator/translate';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/49.0';

// Init CookieJar
var requestJar = request.jar();
request.get({
      url: TRANS_URL,
      jar: requestJar,
      headers: {
        'User-Agent': UA
      }
    },
    function(error, response, body){
      if (!error && response.statusCode == 200) {
        console.log('Init Successfully.');
      }else{
        console.log('Init Faild.');
      }
    });

// Chinese Simplified: zh-Hans
// English: en
// Arabic: ar
function transForm(content, fromLang, toLang) {
  return {
    "Text" : content,
    "SourceLanguage" : fromLang,
    "TargetLanguage" : toLang
  };
}

function transPOST(content, fromLang, toLang, callback) {
  request({
    method: 'POST',
    uri: TRANS_API_URL,
    json: transForm(content, fromLang, toLang),
    jar: requestJar,
    headers: {
      'Content-Type':'application/json',
      'User-Agent': UA,
      'Origin': TRANS_BASE,
      'Referer': TRANS_URL,
      'X-Requested-With':'XMLHttpRequest'
    }
  },
  function(error, response, body){
    if (!error && response.statusCode == 200) {
      callback(null, body.resultNMT);
    }else{
      callback('Error occured when dealing with API.', null);
    }
  });
}
exports.call = transPOST;

//transPOST('非常感谢。', 'zh-Hans', 'en');
//Thank you so much.
//transPOST('非常感谢。', 'zh-Hans', 'ar');
//أشكرك كثيرًا.
