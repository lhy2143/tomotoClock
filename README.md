windows 客户端更新
 包准备
   安装包不能使用nsis,需要使用Squirrel
   更新需要Squirrel配置的nupkg包

 客户端
   npm i electron-squirrel-startup -S
   在主进程开始加上 if (require('electron-squirrel-startup')) return

崩溃监控
  dump 格式的日志,解析该格式文件。electron 源码的symbols文件和 minidump 库。
  https://github.com/electron/electron/releases/download/v13.0.1/electron-v13.0.1-win32-ia32-symbols.zip
  crash-reporter
  socorro
  mini-breakpad-server
  node-minidump
  breakpad 

  主进程和渲染进程都需要初始化crash-reporter
  electron 的 symbol
  koa-multa

  渲染进程崩溃后提示用户重新加载，webContents.crashed()
  多窗的情况下，写崩溃监控的代码显得很冗余，通过preload统一初始化崩溃监控
  主进程、渲染进程通过 process.crash() 可以模拟崩溃

  崩溃治理的难点
  收集到的日志是 Native错误栈，没有上下文信息
  调试electron 的源码，需要使用到 C++ 知识和 GDB 这样的调试工具，这对于前端工程是来说比较困难
  运行环境复杂，不同操作系统，甚至会收到其他桌面软件的影响

白屏优化
BrowserView显示loading
i18nnext 国际化
node-auto-launch 开机自启动  (https://www.npmjs.com/package/auto-launch)


