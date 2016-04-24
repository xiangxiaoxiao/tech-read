/**
 * Created by pomy on 16/4/8.
 */

'use strict';

let request = require('request');
let $ = require('cheerio');
//let coRequest = require('co-request');

let render = require('./render');
let requestPromise = require('./lib');

function* index () {
    this.response.body = yield render('index');
}

function* toutiao() {
    // let resBody = request('http://toutiao.io/', (error, response, body) => {
    //     if(!error && response.statusCode == 200){
    //         return body;
    //     } else {
    //         return reponseBody;
    //     }
    // });
    this.response.set("Content-Type", "application/json;charset=utf-8");

    let resBody = yield requestPromise.parseBody('http://toutiao.io/').then((body) => {
        return body;
    });

    let lists = $(resBody).find('.posts').first().children('.post');

    let toutiaoPrevLists = lists.map((index, list) => {
        let titleObj = $(list).find('.title');
        let title = titleObj.text();
        let originUrl = titleObj.children('a').attr('href');
        let meta = $(list).find('.meta')[0].firstChild.nodeValue;;
        let avatarUrl = $(list).find('img').attr('src');;
        let subjectUrl = $(list).find('.subject-name a').attr('href');
        let subjectOriginUrl = `http://toutiao.io${subjectUrl}`;
        let subjectText = $(list).find('.subject-name a').text();

        return {
            listTitle:title,
            listOriginUrl: originUrl,
            listMeta: meta,
            listAvatarUrl: avatarUrl,
            listSubjectUrl: subjectOriginUrl,
            listSubjectText: subjectText
        };
    });

    let arr = [];

    for (let i = 0, len = toutiaoPrevLists.length; i < len; i++) {
        arr.push(toutiaoPrevLists[i]);
    }

    this.response.body = {
        postLists:arr
    };
}

function* toutiaoArticle() {
    this.response.set("Content-Type", "application/json;charset=utf-8");

    let origin = this.request.get('x-custom-header');

    /**
     *  异步请求同步: Generator 和 Promise
     *  用 request 请求时,没法同步,但可以用 Promise封装了,见 requestPromise
     *  另外就是利用 co-request 看了源码后 也是用 Promise 进行 polyfill
     *  let result = yield coRequest(origin);
        url = result.client._httpMessage._headers.host + result.client._httpMessage.path;
     *  另一个点是 yield 后只能跟 promise/generator等 跟普通的Object会报错
     */
    // let result = yield coRequest(origin);
    // url = result.client._httpMessage._headers.host + result.client._httpMessage.path;
    let url = yield requestPromise.parseUrl(origin).then((path) => {
        return path;
    });
    this.body = JSON.stringify({
        url: url
    });
}

function* toutiaotPrev () {
    this.response.set("Content-Type", "application/json;charset=utf-8");

    let prevUrl = this.request.get('x-custom-header');

    let resBody = yield requestPromise.parseBody(prevUrl).then((body) => {
        return body;
    });

    let lists = $(resBody).find('.post');

    let toutiaoPrevLists = lists.map((index, list) => {
        let titleObj = $(list).find('.title');
        let title = titleObj.text();
        let originUrl = titleObj.children('a').attr('href');
        let meta = $(list).find('.meta')[0].firstChild.nodeValue;;
        let avatarUrl = $(list).find('img').attr('src');;
        let subjectUrl = $(list).find('.subject-name a').attr('href');
        let subjectOriginUrl = `http://toutiao.io${subjectUrl}`;
        let subjectText = $(list).find('.subject-name a').text();

        return {
            listTitle:title,
            listOriginUrl: originUrl,
            listMeta: meta,
            listAvatarUrl: avatarUrl,
            listSubjectUrl: subjectOriginUrl,
            listSubjectText: subjectText
        };
    });

    let arr = [];

    for (let i = 0, len = toutiaoPrevLists.length; i < len; i++) {
        arr.push(toutiaoPrevLists[i]);
    }

    this.response.body = {
        postLists:arr
    };
}

function* geek () {
    this.response.set("Content-Type", "text/plain;charset=utf-8");

    let resBody = yield requestPromise.parseBody('http://geek.csdn.net/').then((body) => {
        return body;
    });

    this.body = resBody;
}

function* bole () {
    this.response.set("Content-Type", "application/json;charset=utf-8");
    
    let resBody = yield requestPromise.parseBody('http://top.jobbole.com/').then((body) => {
        return body;
    });

    let lists = $(resBody).find('.list-posts').children().not('.sponsored');

    let boleLists = lists.map((index, list) => {
        let titleObj = $(list).find('.p-tit a');
        let title = titleObj.text();
        let originUrl = titleObj.attr('href');
        let meta = $(list).find('.p-meta span:first-child').text();
        let avatarUrl = '/pomy.jpg';
        let subjectUrl = $(list).find('.p-tags a').length === 1 ? $(list).find('.p-tags a').attr('href') : '#';
        let subjectText = $(list).find('.p-tags a').length === 1 ? $(list).find('.p-tags a').text() : '无';

        return {
            listTitle:title,
            listOriginUrl: originUrl,
            listMeta: meta,
            listAvatarUrl: avatarUrl,
            listSubjectUrl: subjectUrl,
            listSubjectText: subjectText
        };
    });
    //avoid typeError: Converting circular structure to JSON
    //boleLists的输出如下,转化json时报上述的TypeError错误 因为形成了圈,无法解析,应该转化成数组
    // '0':
    //     { listTitle: 'Adobe 将升级视频剪辑软件Premiere，增加对VR的支持',
    //         listriginUrl: 'http://top.jobbole.com/34418/',
    //         listMeta: '11 小时前',
    //         listAvatarUrl: '/pomy.jpg',
    //         listSubjectUrl: '#',
    //         listSubjectText: '无' },
    //     '1':
    //     { listTitle: '万维网联盟正在Github上开发HTML5.1',
    //         listriginUrl: 'http://top.jobbole.com/34407/',
    //         listMeta: '16 小时前',
    //         listAvatarUrl: '/pomy.jpg',
    //         listSubjectUrl: '#',
    //         listSubjectText: '无' }

    let arr = [];

    for (let i = 0, len = boleLists.length; i < len; i++) {
        arr.push(boleLists[i]);
    }

    this.response.body = {
        postLists:arr
    };
}

function* sg () {
    this.response.set("Content-Type", "application/json;charset=utf-8");

    let resBody = yield requestPromise.parseBody('https://segmentfault.com/blogs').then((body) => {
        return body;
    });

    let origin = 'https://segmentfault.com';
    let lists = $(resBody).find('.stream-list').children();

    let sgLists = lists.map((index, list) => {
        let titleObj = $(list).find('.title a');
        let title = titleObj.text();
        let originUrl = origin + titleObj.attr('href');
        let metaAuthor = $(list).find('.author a:first-child').text();
        let metaTime = $(list).find('.author .split')[0].nextSibling.nodeValue;
        let avatarUrl = $(list).find('.author img').attr('src');
        let a = $(list).find('.author a')[1];
        let subjectUrl = origin + a.attribs.href;
        let subjectText = a.children[0].data;

        return {
            listTitle:title,
            listOriginUrl: originUrl,
            listMetaAuthor: metaAuthor,
            listTime: metaTime,
            listAvatarUrl: avatarUrl,
            listSubjectUrl: subjectUrl,
            listSubjectText: subjectText
        };
    });

    let arr = [];

    for (let i = 0, len = sgLists.length; i < len; i++) {
        arr.push(sgLists[i]);
    }

    this.response.body = {
        postLists:arr
    };
}

exports.register = function (router) {
    router.get('/', index);
    router.get('/index', index);
    router.get('/toutiao', toutiao);
    router.get('/toutiao/article', toutiaoArticle);
    router.get('/toutiao/prev', toutiaotPrev)
    router.get('/geek', geek);
    router.get('/bole', bole);
    router.get('/sg', sg)
};