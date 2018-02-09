var cors_proxy = require('cors-anywhere');
var host = '0.0.0.0';
var port = 1337;
cors_proxy.createServer().listen(port, host, function() {
	console.log('Running CORS Proxy on ' + host + ':' + port);
});