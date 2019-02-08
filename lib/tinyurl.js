var validUrl = require("valid-url");
var crypto = require("crypto");

var {
    connection
} = require('../db/baseDb');

var incrementIndex = 6;

module.exports.createShortUrlAndInsert = function(url) {
    // validate url to be a proper url !!
    this.validateUrl(url);
    return this.insertShortUrl(url, 0, 6);
};

module.exports.insertShortUrl = function(url, start, end) {
    var shortUrl = this.generateTinyUrl(url, start, end);

    return connection.then((con) => {
        var sql = `
        SELECT 
            id, original_url
        FROM
            tinyurl.tinyurls
        WHERE
            short_url = ?
        `;

        return con.query(sql, [shortUrl]);
    }).then(([rows, fields]) => {
        if (rows.length > 0) {
            // already inserted
            // retry only if original url is different
            var data = rows.pop();
            if (data.original_url == url) {
                console.log("pehle bana hua hain same");
                // TODO : have to device what to do when this happens !!
                return {
                    shortUrl,
                    url
                }
            } else {
                console.log("naye url ka same aaya hain kyunki base64 can be same ");
                return this.insertShortUrl(url, end + 1, end + incrementIndex);
            }
        } else {
            // insert new row for same
            return this.insertUrlIntoDatabase(shortUrl, url);
        }
    }).then(() => {
        return {
            shortUrl,
            url
        };
    }).catch((error) => {
        return Promise.reject("doubel fuck off " + error.message);
    });

};

module.exports.insertUrlIntoDatabase = function(shortUrl, originalUrl) {
    return connection.then((con) => {
        var insertQuery = `
            INSERT INTO tinyurl.tinyurls (short_url, original_url) values (?, ?)
        `;
        return con.query(insertQuery, [shortUrl, originalUrl]);
    }).then(([rows, fields]) => {
        Promise.resolve();
    });
};

module.exports.generateTinyUrl = function(url, start, end) {
    const hash = crypto.createHash('md5').update(url).digest("base64").replace(/\//g, '_').replace(/\+/g, '-');
    return hash.substring(start, end);
};

module.exports.validateUrl = function(url) {
    if (validUrl.isUri(url)) {
        return true;
    }
    throw new Error("Invalid url");
};

module.exports.getLongUrl = function(code) {
    if (code == undefined) {
        throw new Error("Invalid code for getting orinal url");
    }

    return connection.then((con) => {
        var sql = `
            SELECT 
                id, short_url, original_url
            FROM
                tinyurl.tinyurls
            WHERE
                short_url = ?
        `;

        return con.query(sql, [code]);
    }).then(([rows, fields]) => {
        if (rows.length > 0) {
            data = rows.pop();
            return {
                originalUrl: data.original_url
            };
        } else {
            throw new Error("No data found for code");
        }
    }).catch((error) => {
        throw new Error("Fucking Error asshole : " + error.message);
    });
};