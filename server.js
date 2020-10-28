const path = require('path');
const Koa = require('koa');
const { parse } = require('url');
const bodyParser = require('koa-bodyparser');
const next = require('next');
const koaJwt = require('koa-jwt');

const jwtConfig = require('./config/jwtConfig');
const routers = require('./routers/index');
const musicRouters = require('./routers/music');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = new Koa();
    server.use(bodyParser());
    server.use(routers.routes());
    server.use(musicRouters.routes());
    server.use(koaJwt({ secret: jwtConfig.jwtSecret, passthrough: true }).unless({
        // 登录，注册接口不需要验证
        path: [/^\/rest\/login/]
    }));
    server.use(async (ctx, next) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next().catch((err)=>{
            if(err.status === 401){
                ctx.status = 401;
                ctx.body = '登录超时，请重新登录';
            }else{
                throw err;
            }
        });
    });

    server.listen(3000, () => {
        console.log('listen on 3000');
    });
});
