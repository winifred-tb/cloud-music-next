const path = require("path");
var request = require('request');
const Router = require('koa-router');
const sharp = require('sharp');
const utility = require("utility");
const jwt = require('jsonwebtoken');

const jwtConfig = require('../config/jwtConfig');
const query = require('../utils/query.js');
const routers = new Router();
const arrBuffer = [];

const rect = new Buffer(
    `<svg width="60" height="60" viewBox="0 0 1279.000000 1280.000000"
    preserveAspectRatio="xMidYMid meet">
   <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" stroke="none">
   <path d="M4810 12789 c-213 -20 -469 -74 -654 -138 -303 -105 -529 -240 -719
   -428 -100 -99 -140 -170 -196 -345 -78 -244 -60 -432 55 -588 79 -107 187
   -173 439 -265 308 -113 376 -183 378 -387 0 -75 -3 -94 -28 -143 -43 -89 -140
   -152 -310 -202 -56 -17 -178 -18 -1840 -23 -1068 -3 -1788 -9 -1800 -14 -43
   -20 -78 -53 -103 -96 l-27 -45 0 -1770 c0 -1973 -5 -1818 69 -2037 50 -148
   106 -238 216 -348 75 -76 111 -104 171 -133 110 -54 211 -77 338 -77 221 0
   401 64 532 188 119 112 174 207 279 482 72 188 99 237 136 246 41 10 112 -2
   209 -37 79 -29 97 -40 148 -93 159 -165 289 -430 360 -731 50 -211 62 -322 62
   -565 -1 -206 -4 -241 -33 -420 -37 -220 -76 -383 -122 -515 -96 -272 -263
   -516 -395 -576 -76 -34 -170 -59 -224 -59 -67 0 -85 28 -181 285 -118 318
   -234 467 -437 561 -97 46 -177 64 -313 71 -150 8 -251 -12 -375 -72 -215 -103
   -374 -329 -434 -615 -9 -41 -11 -525 -9 -1900 3 -2038 -2 -1867 64 -1934 66
   -65 15 -61 814 -58 399 1 1202 7 1785 12 1143 11 1142 10 1312 66 174 57 334
   158 426 270 58 71 121 195 144 284 22 87 22 277 -1 385 -24 111 -91 246 -161
   323 -104 114 -233 190 -470 277 -138 51 -219 88 -247 113 -27 23 -23 114 8
   208 37 111 44 123 120 194 220 206 601 354 1031 400 407 44 1013 -54 1358
   -220 125 -61 231 -130 317 -209 58 -54 70 -71 97 -141 38 -101 56 -196 42
   -231 -14 -38 -56 -60 -257 -138 -276 -105 -354 -150 -464 -267 -216 -229 -260
   -636 -98 -912 49 -84 189 -218 282 -271 44 -25 129 -62 190 -83 212 -71 106
   -68 2037 -68 1930 0 1787 -5 1862 68 72 70 67 -64 67 1931 l0 1796 25 69 c67
   190 175 267 352 252 181 -15 239 -77 351 -376 68 -183 87 -224 139 -302 158
   -239 413 -299 761 -176 154 54 212 90 320 203 227 235 395 571 481 960 34 153
   80 446 92 581 26 293 -14 680 -100 981 -99 344 -247 616 -450 825 -91 95 -116
   114 -185 148 -415 196 -735 142 -915 -155 -19 -31 -59 -120 -88 -198 -94 -248
   -123 -307 -178 -364 -60 -62 -129 -86 -246 -86 -135 -1 -214 54 -284 198 -75
   154 -69 -4 -75 1981 l-5 1781 -30 48 c-22 36 -45 57 -84 77 l-53 28 -1804 0
   -1804 0 -73 25 c-198 69 -280 196 -248 387 26 160 83 208 371 316 74 28 158
   60 185 73 333 148 434 429 294 824 -59 168 -83 207 -199 319 -187 180 -417
   315 -702 410 -165 55 -296 86 -533 126 -298 49 -525 61 -765 39z"/>
   </g>
   </svg>`
);

routers.get('/rest/getImage', async (ctx) => {
    const { userName = null } = ctx.query;
    const imgInfo = await createImage();
    const itemIndex = arrBuffer.findIndex(v => v.name === userName)
    if (itemIndex !== -1) {
        arrBuffer.splice(itemIndex, 1, { name: userName, x: imgInfo.x })
    } else {
        arrBuffer.push({ name: userName, x: imgInfo.x })
    }
    delete imgInfo.x;
    ctx.body = { status: 0, data: imgInfo }
});

// 生成大图和小图,返回base64
function createImage() {
    return new Promise((resolve, reject) => {
        var render = {
            bg: '',
            ani: '',
            x: 0,
            y: 0
        };
        var filePath = path.resolve(__dirname, `../public/rand` + getRandom());
        var x = getRandomX(), y = getRandomY();
        sharp(filePath)
            .composite([{ input: path.resolve(__dirname, `../public/coverBig.png`), left: 0, top: 0 }, {
                input: rect,
                blend: 'dest-out',
                left: x,
                top: y
            }])
            .png()
            .toBuffer((err, data, info) => {
                if (err) {
                    reject(err + '1')
                } else {
                    render.bg = "data:image/jpg;base64," + data.toString("base64");
                    sharp(filePath)
                        .composite([
                            {
                                input: rect,
                                blend: 'dest-in',
                                left: x,
                                top: y
                            }
                        ])
                        .png()
                        .toBuffer((err, buffer, info) => {
                            if (err) {
                                reject(err + '2')
                            } else {
                                sharp(buffer)
                                    .extract({ left: x, top: y, width: 60, height: 60 })
                                    .toBuffer((err, bufferAni, info) => {
                                        if (err) {
                                            reject(err + '3')
                                        } else {
                                            render.ani = "data:image/jpg;base64," + bufferAni.toString("base64");
                                            render.y = y;
                                            render.x = x;
                                            resolve(render)
                                        }
                                    })
                            }
                        });
                }
            });
    });
}

function getRandom() {
    var num = Math.floor(Math.random() * 9) + 1;
    return num;
}

function getRandomX() {
    var num = Math.floor(Math.random() * 200) + 140;
    return num;
}

function getRandomY() {
    var num = Math.floor(Math.random() * 180) + 1;
    return num;
}

routers.post('/rest/checkCode', async (ctx) => {
    ctx.body = ctx.request.body;
    const itemIndex = arrBuffer.findIndex(v => v.name === ctx.body.phone)
    if (itemIndex === -1) {
        ctx.body = { code: 501, msg: "图片验证错误,请刷新重试" };
        return;
    }
    const isMatch = Math.abs(ctx.body.x - arrBuffer[itemIndex].x) < 5;
    if (!isMatch) {
        ctx.body = { code: 502, msg: "图片验证错误,请刷新重试" }
        return;
    }
    ctx.body = { status: 0, data: true }
});

routers.post('/rest/login', async (ctx) => {
    ctx.body = ctx.request.body;
    const itemIndex = arrBuffer.findIndex(v => v.name === ctx.body.phone)
    if (itemIndex === -1) {
        ctx.body = { code: 501, msg: "图片验证错误,请刷新重试" };
        return;
    }
    const isMatch = Math.abs(ctx.body.x - arrBuffer[itemIndex].x) < 5;
    if (!isMatch) {
        ctx.body = { code: 502, msg: "图片验证错误,请刷新重试" }
        return;
    }
    arrBuffer.splice(itemIndex, 1)
    const user = await query("SELECT * FROM `user` WHERE phone=?  LIMIT 1 OFFSET 0", ctx.body.phone).then((user) => {
        if (user.length > 0) {
            if (utility.md5(ctx.body.password) === user[0].password) {
                const data = user[0];
                delete data.password;
                data.token = jwt.sign({ data }, jwtConfig.jwtSecret, { expiresIn: jwtConfig.tokenExpiresTime });
                ctx.body = { status: 0, data: data }
            } else {
                ctx.body = { status: 500, msg: "密码错误!" }
            }
        } else {
            ctx.body = { status: 500, msg: "账号不存在!" }
        }
    }).catch((err) => {
        ctx.body = { status: 500, msg: "登录失败" + err }
    });
});

module.exports = routers;