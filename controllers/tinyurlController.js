var tinyurl = require('../lib/tinyurl');
var createError = require('http-errors');
var baseUrl = "https://hulk.in/";

module.exports.createTinyUrl = function(request, response, next) {
    // check if url exists
    if (request.body.url == undefined) {
        throw new Error("Empty Url for shortening");
    }

    tinyurl.createShortUrlAndInsert(request.body.url).then((url) => {
        response.json({
            shortUrl: baseUrl + url.shortUrl,
            url: url.url
        });
    }).catch((error) => {
        next(createError(error));
    });
};

module.exports.getLongUrl = function(request, response, next) {
    if (request.query.code == undefined) {
        throw new Error("Empty Short Code");
    }

    tinyurl.getLongUrl(request.query.code).then((url) => {
        response.json(url);
    }).catch((error) => {
        next(createError(error))
    });
};