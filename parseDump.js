// windows上解析失败
var minidump = require('minidump');
console.log(minidump);
minidump.addSymbolPath('./symbols/breakpad_symbols');
minidump.walkStack(
  './server/crash/upload_56abe34c03c4ddeaf75995a2de4c59f5.dmp',
  (err, data) => {
    console.log(111, err);
    console.log(222, data);
  }
);
