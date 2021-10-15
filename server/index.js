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
const fse = require('fs-extra');

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
      onFileBegin: (formName, file) => {
        // 大文件上传的文件重命名，便于按顺序合成最终文件
        file.path = 'F:\\trial\\tomatoClock\\server\\crash\\' + formName;
      },
    },
  })
);

// 前端传入的Authorization需为使用相同的secret签名sign过的值才能认证成功
// const jwt2 = require('jsonwebtoken');
// jwt2.sign({ name: 'lhy' }, 'shared-secret');
// jwt2.sign('aaa', 'shared-secret')
// app.use(jwt({ secret: 'shared-secret' }).unless({ method: 'OPTIONS' }));
router.get('/', (ctx, next) => {
  ctx.body = 'hello world';
});
router.get('/getData', (ctx, next) => {
  ctx.body = { data: [] };
});

const uploadCrash = multer({ dest: 'crash/' });

router.post('/crash', uploadCrash.any(), (ctx, next) => {
  ctx.body = 'test';
  ctx.status = 200;
  // 存DB
});
const pipeStream = (path, writeStream) =>
  new Promise((resolve) => {
    const readStream = fse.createReadStream(path);
    readStream.on('end', () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });
const mergeFileChunk = async (filePath, fileHash, size = 10 * 1024 * 1024) => {
  filePath = 'F:\\trial\\tomatoClock\\server\\crash\\客户端导航框架-0.0.32.dmg';
  const chunkDir = path.resolve(__dirname, './crash');
  const chunkPaths = await fse.readdir(chunkDir);
  console.log(chunkPaths);
  // 根据切片下标进行排序
  // 否则直接读取目录的获得的顺序可能会错乱
  chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        // 指定位置创建可写流
        fse.createWriteStream(filePath, {
          start: index * size,
          end: (index + 1) * size,
        })
      )
    )
  );
};
router.get('/merge', async (ctx, next) => {
  await mergeFileChunk();
  ctx.body = 'ok';
  ctx.status = 200;
});

app.use(serve({ rootDir: 'RELEASE/mac', rootPath: '/mac' }));
app.use(serve({ rootDir: 'RELEASE/win32', rootPath: '/win32' }));
app.use(router.routes()).use(router.allowedMethods());

app.listen(9999, () => {
  console.log('app is listening at 9999');
});
