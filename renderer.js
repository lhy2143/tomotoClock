// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron');

function getTime() {
  db.find({}, function (err, docs) {
    console.log('docs,', JSON.parse(docs[0].planet));
  });
  console.time('test');
  console.log(JSON.parse(store.get('unicorn')).features);
  console.log(store.get('name'));
  console.timeEnd('test');
}

let timer = -1;

function getNumber() {
  return parseInt(document.querySelector('.clock-number').innerHTML);
}
function setNumber(number) {
  console.log('number,', number);
  document.querySelector('.clock-number').innerHTML = number;
}

function startWork() {
  start(getNumber() === 0 ? 10 : getNumber());
}

function startRest() {
  start(5);
}

function clearTimer() {
  timer && clearTimeout(timer);
}

function start(number) {
  clearTimer();
  setNumber(number);
  timer = setTimeout(() => {
    if (number > 0) {
      number -= 1;
      start(number);
    } else {
      pause();
      ipcRenderer.invoke('work-or-rest').then((res) => {
        console.log('res,', res);
        if (res.response === 0) {
          startWork();
        } else {
          startRest();
        }
      });
    }
  }, 1000);
}

function pause() {
  clearTimer();
}

function restart() {
  pause();
  setNumber(10);
  // start(0)
}

setTimeout(() => {
  process.crash();
}, 10 * 1000);
