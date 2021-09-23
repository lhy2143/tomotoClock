// Modules to control application life and create native browser window
const {
  app,
  ipcMain,
  dialog,
  Tray,
  Menu,
  Notification,
  BrowserWindow,
  autoUpdater,
} = require('electron');
const isDev = require('electron-is-dev');
const { log } = require('./logger');

// let AutoLaunch = require("auto-launch");
// if (require("electron-squirrel-startup")) return;
// let minecraftAutoLauncher = new AutoLaunch({
//   name: "Minecraft",
//   path: "/Applications/Minecraft.app",
// });

// minecraftAutoLauncher.enable();

//minecraftAutoLauncher.disable();

// minecraftAutoLauncher
//   .isEnabled()
//   .then(function (isEnabled) {
//     if (isEnabled) {
//       return;
//     }
//     minecraftAutoLauncher.enable();
//   })
//   .catch(function (err) {
//     // handle error
//   });

const { crashReporter } = require('electron');

const path = require('path');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  handlerMessage();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

async function showMesssageBox() {
  return dialog.showMessageBox({
    message: '可以休息啦,',
    type: 'info',
    buttons: ['继续工作', '开始休息'],
    cancelId: 1,
  });
}

function handlerMessage() {
  ipcMain.handle('work-or-rest', async () => {
    log('handleMessage...');
    return await showMesssageBox();
    // let res = await new Promise((resolve, reject) => {
    //   let notification = new Notification({
    //     title: '任务结束',
    //     body: '是否开始休息',
    //     actions: [{ text: '开始休息', type: 'button' }],
    //     closeButtonText: '继续工作'
    //   })
    //   notification.show()
    //   notification.on('action', () => {
    //     resolve('rest')
    //   })
    //   notification.on('close', () => {
    //     resolve('work')
    //   })
    // })
    // return res
  });
}

app.on('will-finish-launching', () => {
  console.log('main-crashReporter,', crashReporter.start);
  crashReporter.start({
    productName: 'Mercurius',
    companyName: 'geektime',
    submitURL: 'http://127.0.0.1:8090/crash',
    uploadToServer: true,
    compress: false,
  });
  if (!isDev) {
    require('./updater.js');
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  tray = new Tray('./build/icon.ico');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: function () {
        // ipc.send('close-main-window');
        app.quit();
      },
    },
  ]);
  tray.setToolTip('番茄钟');
  tray.setContextMenu(contextMenu);

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// setTimeout(() => {
//   process.crash();
// }, 10 * 1000);
