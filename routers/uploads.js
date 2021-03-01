const Router = require('koa-router');
const path = require('path');
const md5 = require('md5');
const fs = require('fs');
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');

const uploadsRouters = new Router();


uploadsRouters.post('/rest/upload', async (ctx) => {
    const file = ctx.request.files.file;
    if (!file) {
        ctx.body = { status: 500, msg: "上传失败!" };
        return;
    }
    const fileReader = fs.createReadStream(file.path);
    //新建一个文件名
    const filename = md5(file.name) + path.extname(file.name).toLocaleLowerCase();

    //文件生成绝对路径
    //当然这里这样是不行的，因为你还要判断一下是否存在文件路径
    const target = path.join('public/uploads', filename);
    //生成一个文件写入 文件流
    const writeStream = fs.createWriteStream(target);
    try {
        //异步把文件流 写入
        await awaitWriteStream(fileReader.pipe(writeStream));
    } catch (err) {
        //如果出现错误，关闭管道
        await sendToWormhole(stream);
        throw err;
    }
    //文件响应
    ctx.body = {
        url: '/uploads/' + filename,
        status: 0
    };
});

module.exports = uploadsRouters;