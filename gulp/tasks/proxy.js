import gulp from 'gulp'
var shell = require('gulp-shell')
var cors_proxy = require('cors-anywhere');

gulp.task('proxy', function() {
	var host = '0.0.0.0';
	var port = 1337;
	cors_proxy.createServer().listen(port, host, function() {
	    console.log('Running CORS Proxy on ' + host + ':' + port);
	});
})


// gulp.task('proxy', shell.task([
//   './node_modules/.bin/corsproxy'
// ]))
