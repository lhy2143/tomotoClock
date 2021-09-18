const { app, dialog, autoUpdater } = require('electron');
// const log = require('electron-log');
const { log } = require('./logger');
log(111);
if (process.platform === 'darwin') {
  autoUpdater.setFeedURL(
    'http://127.0.0.1:8090/darwin?version=' + app.getVersion()
  );
} else {
  // 设置以下feedUrl，会自动去 'http://127.0.0.1:8090/win32/RELEASES?version='+app.getVersion() 路径获取是否有更新
  // 若有更新，会返回响应的RELEASE信息，如：396E41B96C1222461AB5D9653AA77825343B2D41 electron-quick-start-1.0.0-full.nupkg 86878690
  // 接着会自动去 http://127.0.0.1:8090/win32/electron-quick-start-1.0.0-full.nupkg 路径获取最新安装包
  // 一般会重定向获取最新安装包的路径到 s3 或 静态文件服务
  // Windows,设置setFeedURL后,会默认去获取url/latest.yml文件,根据其中的version字段来判断是否有更新
  console.log(222);
  autoUpdater.setFeedURL(
    'http://127.0.0.1:8090/win32?version=' + app.getVersion()
  );
}
log(333);

// 该步骤报错
autoUpdater.checkForUpdates();
autoUpdater.on('update-available', () => {
  log('update-available');
});

autoUpdater.on('update-downloaded', () => {
  app.whenReady().then(() => {
    let clickId = dialog.showMessageBoxSync({
      type: 'info',
      title: '升级提示',
      message: '已为你升级到最新版，是否立即体验',
      buttons: ['马上升级', '手动重启'],
      cancelId: 1,
    });
    if (clickId === 0) {
      autoUpdater.quitAndInstall();
      app.quit();
    }
  });
});

autoUpdater.on('error', (error) => {
  log('autoUpdater---', error.toString());
});
