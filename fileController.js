'use strict';
var fs = require('fs');
var join = require('path').join;

class fileController {
  constructor(context, timeout) {
    this._context = join(__dirname + context);
    this._timeout = timeout;
  }

  removeFile(route) {
    if(route !== '/' && route.search(/\.(js|css|jpg|png|gif|ico)?$/) === -1 ) {
      setTimeout( () => {
        this._deleteFile( join(this._context + route) )
      }, this._timeout);
    }
  }

  setTimeout(nTime) {
    this._timeout = nTime;
  }

  _deleteFile (file) { 
    fs.unlink(file, (err) => {
      if (err) {
        console.error( err.toString() );
      } else {
        console.log('%s deleted', file);
      }
    });
  }
}

module.exports = fileController;
