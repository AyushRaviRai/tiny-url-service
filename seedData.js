var request = require("request");

count = 26037;
while (count < 50000) {
    var options = {
        method: 'POST',
        url: 'http://localhost:3000/url-service/shorten',
        headers: {
            'Postman-Token': '3213c8bf-6db7-4964-829e-1377b98dd078',
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        },
        body: {
            url: 'https://www.shopclues.com/v11/order/' + count
        },
        json: true
    };

    request(options, function(error, response, body) {
        if (error) {
            console.log("error message : " + error.message);
        } else {
            console.log(body);
        }

    });
    count = count + 1;
}

console.log("done");