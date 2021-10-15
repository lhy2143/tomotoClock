###### 1、启动electron

全局安装electron，在入口文件目录执行

```
electron .
```

###### 2、使能渲染进程的node模块

```
//nodeIntegration属性
new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: { nodeIntegration: true },
  });
```

###### 3、渲染进程中使用remote

```
//enableRemoteModule属性
mainWin = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: { 
     nodeIntegration: true, 
     enableRemoteModule: true 
     },
  });
  
  const {BrowserWindow} = require("electron").remote;
  
  //以下的路径是和项目根路径拼接起来的
  newWin.loadFile("electron/demo3/yellow.html");
```

###### 4、创建菜单并添加点击事件

```
//menu.js。在main.js中require该js文件
const { Menu, BrowserWindow } = require("electron");

let template = [
  {
    label: "浙江省",
    submenu: [
      {
        label: "杭州市",
        //快捷键
        accelerator: "ctrl+l",
        click: () => {
          let win = new BrowserWindow({
            width: 500,
            height: 500,
          });
          win.loadFile("electron/demo3/yellow.html");
          win.on("close", () => {
            win = null;
          });
        },
      },
      { label: "温州市" },
    ],
  },
  { label: "江苏省", submenu: [{ label: "南京市" }, { label: "无锡市" }] },
];

let m = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(m);

```

###### 5、创建右键菜单

```
//在渲染进程中引入以下js
const { remote } = require("electron");
let rightTemplate = [
  { label: "粘贴", accelerator: "ctrl+v" },
  { label: "复制", accelerator: "ctrl+c" },
];

let m = remote.Menu.buildFromTemplate(rightTemplate);

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  m.popup({ window: remote.getCurrentWindow() });
});
```

###### 6、在浏览器中打开链接

```
//a标签的默认事件会直接在窗口中打开，并且会覆盖原本窗口的内容
const { shell } = require("electron");
let aHref = document.querySelector("#aHref");
aHref.onclick = function (e) {
  e.preventDefault();
  let href = this.getAttribute("href");
  shell.openExternal(href);
};

```

###### 7、嵌入网页和打开子窗口

```
//嵌入网页
  let view = new BrowserView();
  mainWin.setBrowserView(view);
//x和y定义位置，width和height定义大小
  view.setBounds({ x: 0, y: 300, width: 800, height: 500 });
  view.webContents.loadURL("http://www.baidu.com");
  
//打开子窗口
window.open("../child.html");
```

###### 8、父子窗口通信

```
//子窗口，该子窗口是通过BrowserWindow来打开的
document.querySelector("#child").onclick = function (e) {
      //第二个参数不写表示传递给所有的父窗口
      window.opener.postMessage("child-message");
    };
//父窗口
window.addEventListener("message", (data) => {
  //接受子窗口传递的信息
  document.querySelector("#childMsg").innerHTML = JSON.stringify(data.data);
});
```

###### 9、选择文件和保存文件对话框

```
const { dialog, app } = require("electron").remote;
    const fs = require("fs");

    document.querySelector("#fileBtn").onclick = function () {
      dialog
        .showOpenDialog({
          title: "请选择文件",
          defaultPath: app.getPath("downloads"),
          filters: [{ name: "img", extensions: ["png"] }],
          buttonLabel: "自定义",
        })
        .then((result) => {
          let { canceled, filePaths, bookmarks } = result;
          document.querySelector("#images").setAttribute("src", filePaths[0]);
        })
        .catch((err) => {});
    };

    document.querySelector("#saveBtn").onclick = function () {
      dialog
        .showSaveDialog({
          title: "保存文件",
        })
        .then((result) => {
          console.log(result);
          fs.writeFileSync(result.filePath, "test write file");
        })
        .catch((err) => {
          console.log(err);
        });
    };
```

###### 10、消息对话框

```
document.querySelector("#messageBtn").onclick = function () {
      dialog
        .showMessageBox({
          type: "none",
          title: "喜欢谁?",
          buttons: ["苏东坡", "李清照"],
        })
        .then((result) => {
          console.log("喜欢的词人是", result);
        });
    };
```

###### 11、检测网络通断

```
//渲染进程
const { ipcRenderer } = require("electron");
    const status = function () {
    //reply为接受的同步消息
      let reply = ipcRenderer.sendSync(
        "online-status-changed",
        navigator.onLine ? "online!" : "offline!"
      );
      console.log(reply);
    };
    ipcRenderer.on("main-reply", (event, arg) => {
    //arg为接受的异步消息
      console.log("render", arg);
    });
    window.addEventListener("online", status);
    window.addEventListener("offline", status);
    status();
    
//主进程
ipcMain.on("online-status-changed", (event, arg) => {
  console.log("main", arg);
  //发送同步消息
  event.returnValue = "synchronous:get!";
  //发送异步消息
  event.reply("main-reply", "get!");
});
```

#### 12、注册快捷键

```
//快捷键在主进程中使用
//如果快捷键被占用了，则会注册失败
app.on("ready", () => {
  globalShortcut.register("ctrl+shift+a", () => {
    mainWin.loadURL("http://www.baidu.com");
  });
  console.log("result---", globalShortcut.isRegistered("ctrl+shift+a"));
  })
```

#### 13、剪切板功能

```
//clipboard功能在主进程和渲染进程都可以使用
 const { clipboard } = require("electron");
    const { dialog } = require("electron").remote;
    document.querySelector("#notifyBtn").onclick = function () {
      var option = { title: "工资单", body: "明细" };
      new window.Notification(option.title, option);
    };

    document.querySelector("#copyBtn").onclick = function () {
    //写到剪贴板后，就可以使用ctrl+v粘贴
      clipboard.writeText(document.querySelector("#code").innerHTML);
      dialog.showMessageBox({
        type: "none",
        title: "消息",
        message: "复制成功!",
        buttons: [],
      });
    };
```