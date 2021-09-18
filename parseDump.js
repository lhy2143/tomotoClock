var minidump = require('minidump');
console.log(minidump);
minidump.addSymbolPath('./symbols/breakpad_symbols');
minidump.walkStack('./server/crash/ackpluginx.exe.6440.dmp', (err, data) => {
  console.log(111, err);
  console.log(222, data);
});
