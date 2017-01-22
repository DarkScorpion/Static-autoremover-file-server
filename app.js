
var nodeStatic = require('node-static');

var config = require('./config.js');
var getIP = require('./lib/getIP.js')
var frClass = require('./lib/fileRemover.js');

var PORT = config.port;
var TIMEOUT = config.timeout;
var PUBLIC_PATH = __dirname + '/public';

var fileRemover = new frClass( PUBLIC_PATH, TIMEOUT );
var file = new nodeStatic.Server( PUBLIC_PATH );

fileRemover.addExtension(['rar', 'pdf']);
//fileRemover.removeExtension(['pdf']);
require('http').createServer( (req, res) => {
  req.addListener('end', () => {
    file.serve(req, res, (err, result) => {
      if (err) {
        console.error('!> Error: %s %s - %s ', req.url, req.method, err.message);
        res.writeHead(err.status, err.headers);
        res.end();
      } else {
        console.log( '> %s  %s %s', req.url, req.method, getIP(req) );
        fileRemover.removeFile(req.url);
      }
    });
  }).resume();
}).listen(PORT || 8080, () => {
  console.log('Static autoremove content server start!')
  console.log( 'Extesion for remove: ', fileRemover.getExtList() )
});
