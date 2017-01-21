//'use strict';
var nodeStatic = require('node-static');

var config = require('./config.js');
var fcClass = require('./fileController.js');

var PORT = config.port;
var TIMEOUT = config.timeout;

var fileCtrl = new fcClass('/public', TIMEOUT);
var file = new nodeStatic.Server('./public');
 
require('http').createServer( (req, res) => {
  req.addListener('end', () => {
    file.serve(req, res, (err, result) => {
      if (err) {
        console.error('!> Error: %s %s - %s ', req.url, req.method, err.message);
        res.writeHead(err.status, err.headers);
        res.end();
      } else {
        console.log( '> %s  %s %s', req.url, req.method, getIP(req) );
        fileCtrl.removeFile(req.url);
      }
    });
  }).resume();
}).listen(PORT || 8080, () => {
  console.log('Static server start!')
});

function getIP(req) {
  var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  return ip.replace('::ffff:', '');
}
