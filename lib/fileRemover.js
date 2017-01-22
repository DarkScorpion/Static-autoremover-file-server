'use strict';
var fs = require('fs');
var join = require('path').join;
var typeOf = require('./typeOf.js');

const DEF_REMOVE_EXT = ['html', 'zip'];

class fileRemover {
  constructor(context, timeout) {
    this._context = join(context)
    this._timeout = timeout;
    this.addExtension(DEF_REMOVE_EXT);
  }

  removeFile(route) {
    if(route.search(this._extRegExp) > -1 ) {
      setTimeout( () => {
        this._deleteFile( join(this._context + route) )
      }, this._timeout);
    }
  }

  setTimeout(nTime) {
    this._timeout = nTime;
  }

  getExtList() {
    return this._copyArr(this._extArr);
  }

  addExtension(ext) {
    if( typeOf(ext) === 'array' ) {
      this._extArr = this._concatArr(this._extArr || [], ext);
    } else {
      this._extArr.push(ext);
    }

    this._updateExtRegexp();
  }

  removeExtension(ext) {
    var arr = this._extArr;
    if( typeOf(ext) === 'array' ) {
      for(var i=0; i<ext.length; i++) {
        this._deleteOneExt(ext[i]);
      }
    } else {
      this._deleteOneExt(ext);
    }

    this._updateExtRegexp();
  }

  _updateExtRegexp() {
    var regStr = '\\.('+ this._extArr.join('|') +')?$';
    this._extRegExp = new RegExp(regStr);
  }

  _deleteOneExt(ext) {
    var arr = this._extArr;
    var index = arr.indexOf(ext);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }

  _deleteFile(file) {
    fs.unlink(file, (err) => {
      if (err) {
        console.error( err.toString() );
      } else {
        console.log('%s deleted', file);
      }
    });
  }

  _copyArr(arr) {
    return arr.slice(0, arr.length);
  }

  _concatArr(arr1, arr2) {
    var temp = this._copyArr(arr1);

    for(var i=0; i<arr2.length; i++) {
      if( temp.indexOf(arr2[i]) === -1) {
        temp.push(arr2[i]);
      }
    }

    return temp;
  }
}

module.exports = fileRemover;
