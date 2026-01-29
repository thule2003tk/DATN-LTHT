const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/sanpham',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response Length:', data.length);
        try {
            const json = JSON.parse(data);
            console.log('Number of products returned:', json.length);
            if (json.length > 0) {
                console.log('First product:', json[0].ten_sp);
            }
        } catch (e) {
            console.log('Response is not JSON:', data.substring(0, 100));
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
