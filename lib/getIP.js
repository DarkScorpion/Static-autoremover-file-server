
function getIP(req) {
  var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  return ip.replace('::ffff:', '');
}

module.exports = getIP;