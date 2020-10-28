const Router = require('koa-router');
const superagent = require("superagent");
var cheerio = require('cheerio');

const musicRouters = new Router();
const api = 'http://106.55.29.29:3000';

musicRouters.post('/rest/musicApi', async (ctx) => {
    ctx.body = ctx.request.body;
    const data = await getMusic(ctx.body.url);
    ctx.body = { status: 0, data: data }
});

async function getMusic(url) {
    const html = await superagent.get(api + encodeURI(url));
    const data = JSON.parse(html.text);
    return data;
}

module.exports = musicRouters;