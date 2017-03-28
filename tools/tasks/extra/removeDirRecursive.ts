const fs = require('fs');
function removeDirRecursive(path: any) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file: any,index: any){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        removeDirRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = removeDirRecursive;