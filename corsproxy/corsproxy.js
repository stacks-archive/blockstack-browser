var cors_proxy = require('cors-anywhere');
var host = process.argv[4] || 'localhost';
var port = 1337;
cors_proxy.createServer().listen(port, host, function() {
	console.log('Running CORS Proxy on ' + host + ':' + port);
});
