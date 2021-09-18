const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const cors = require('@koa/cors');
const serve = require('koa-static-server');
const router = new Router();
const compareVersions = require('compare-versions');
const multer = require('koa-multer');
const koaBody = require('koa-body');
const path = require('path');
const fs = require('fs');

const open = require('open');

var c = require('child_process');
const { fstat } = require('fs-extra');

let result = '';

process.on('unhandledRejection', (e) => {
  console.log(`unhandledRejection:${e}`);
});

process.on('uncaughtException', (e) => {
  console.log(`uncaughtException:${e}`);
});

function openBrowser() {
  // 使用默认浏览器打开
  c.exec('start http://localhost:8090/result');
}

app.use(cors());

app.use(
  koaBody({
    // 支持文件格式
    multipart: true,
    encoding: null,
    formidable: {
      // 上传目录
      uploadDir: path.join(__dirname, './crash'),
      keepExtensions: true,
      fileBegin: (formName, file) => {
        console.log(111, formName, file);
      },
    },
  })
);

router.get('/getData', (ctx, next) => {
  ctx.body = { data: [] };
});
router.get('/result', (ctx, next) => {
  ctx.body = JSON.stringify(result, null, 4);
});

router.post('/crash2', (ctx, next) => {
  console.log('crash,', ctx.request.body);
  result = ctx.request.body;
  openBrowser();
  // console.log(666, ctx.request.files.file)
  ctx.body = 'test';
  ctx.status = 200;
  // 存DB
});

const uploadCrash = multer({ dest: 'crash/' });

function getNewVersion(version) {
  if (!version) return null;
  let maxVersion = {
    name: '1.0.1',
    pub_date: '2020-02-01T12:26:53+1:00',
    notes: '新增功能AAA',
    url: `http://127.0.0.1:8090s/public/Mercurius-1.0.1-mac.zip`,
  };
  if (compareVersions.compare(maxVersion.name, version, '>')) {
    return maxVersion;
  }
  return null;
}

router.post('/crash', uploadCrash.single('avatar'), (ctx, next) => {
  console.log('crash,', ctx.request);
  ctx.body = 'test';
  ctx.status = 200;
  // 存DB
});

// router.get('/win32/latest.yml', (ctx) => {
//   console.log('version---,', ctx.query.version);
//   ctx.body = fs.createReadStream('release/0.0.31/latest.yml');
// });
router.get('/win32/RELEASES', (ctx, next) => {
  let newVersion = getNewVersion(ctx.query.version);
  console.log('newVersion,', newVersion);
  if (newVersion) {
    // 动态返回最新的包的信息
    ctx.body =
      '5181F50B0123AFA6CFDA4C73FB667988BD605C0B electron-quick-start-1.1.0-full.nupkg 404590861';
  } else {
    ctx.status = 204;
  }
});

router.get('/win32/electron-quick-start-1.1.0-full.nupkg', (ctx, next) => {
  ctx.redirect('/public/electron-quick-start-1.1.0-full.nupkg');
  // ctx.status = 204
});

router.get('/darwin', (ctx, next) => {
  console.log(66, ctx);
  // 处理Mac更新, ?version=1.0.0&uid=123
  let { version } = ctx.query;
  let newVersion = getNewVersion(version);
  if (newVersion) {
    ctx.body = newVersion;
  } else {
    ctx.status = 204;
  }
});
app.use(serve({ rootDir: 'RELEASE/mac', rootPath: '/mac' }));
app.use(serve({ rootDir: 'RELEASE/win32', rootPath: '/win32' }));
app.use(router.routes()).use(router.allowedMethods());

app.listen(8090, () => {
  console.log('app is listening at 8090');
});
