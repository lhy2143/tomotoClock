const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const cors = require('@koa/cors');
const jwt = require('koa-jwt');

const serve = require('koa-static-server');
const router = new Router();
const multer = require('koa-multer');
// koa-bodyparser
const koaBody = require('koa-body');
const path = require('path');

process.on('unhandledRejection', (e) => {
  console.log(`unhandledRejection:${e}`);
});

process.on('uncaughtException', (e) => {
  console.log(`uncaughtException:${e}`);
});

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

// 前端传入的Authorization需为使用相同的secret签名sign过的值才能认证成功
// const jwt2 = require('jsonwebtoken');
// jwt2.sign({ name: 'lhy' }, 'shared-secret');
// jwt2.sign('aaa', 'shared-secret')
app.use(jwt({ secret: 'shared-secret' }));

router.get('/getData', (ctx, next) => {
  ctx.body = { data: [] };
});

const uploadCrash = multer({ dest: 'crash/' });

router.post('/crash', uploadCrash.any(), (ctx, next) => {
  ctx.body = 'test';
  ctx.status = 200;
  // 存DB
});

app.use(serve({ rootDir: 'RELEASE/mac', rootPath: '/mac' }));
app.use(serve({ rootDir: 'RELEASE/win32', rootPath: '/win32' }));
app.use(router.routes()).use(router.allowedMethods());

app.listen(8090, () => {
  console.log('app is listening at 8090');
});
