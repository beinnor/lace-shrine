/*
  Validates urls.
  Returns true if url validates, false if not.
*/
const dns = require('dns');
const { URL } = require('url');

exports.validate = function(url, callback) {
  
  let longUrl = null;
  let err = null;
  try {
    longUrl = new URL(url);
  } catch (err) {
    return callback(err, null);
  }
  dns.lookup(longUrl.hostname, (err, address, family) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, longUrl.origin);
  });  
  
};
