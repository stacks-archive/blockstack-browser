/*
 Quick and dirty server for serving single page apps on localhost.

 Usage:
 node blockstackProxy.js <port> <basePath>
*/

var http = require("http"),
    path = require("path"),
    url = require("url"),
    fs = require("fs"),
    port = process.argv[2] || 8888,
    host = process.argv[4] || 'localhost',
    basePath = process.argv[3] || "./browser";

var checkPrefix = function (prefix, candidate) {
    // .resolve() removes trailing slashes
    var absPrefix = path.resolve(prefix) + path.sep;
    var absCandidate = path.resolve(candidate) + path.sep;
    return absCandidate.substring(0, absPrefix.length) === absPrefix;
}


/*
  Our own quick mime lookup because nexe fails to
  include the npm package mime's list of mime types
*/
var mimeLookup = function(filename) {
  var tokens = filename.split('.');

  if(tokens.length == 0) // default to html
    return "text/html";

  var extension = tokens[tokens.length - 1];

  if(extension == "html")
    return "text/html";
  if(extension == "png")
    return "image/png";
  if(extension == "svg")
    return "image/svg+xml";
  if(extension == "jpg")
    return "image/jpeg";
  if(extension == "css")
    return "text/css";

  return "text/html";
}

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(basePath, uri);

  var attemptedTraversal = !checkPrefix(basePath, filename)

  fs.exists(filename, function(exists) {

    /* Always load the single page app index.html
    unless another file exists or this is a directory */
    if(!exists || attemptedTraversal || fs.statSync(filename).isDirectory()) {
      filename = basePath + "/index.html"
    }

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200, {
        "Content-Type": mimeLookup(filename),
        "X-Frame-Options":	"DENY",
        "Cache-Control": "private, max-age=0, no-cache"
     });
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10), host);

console.log("Blockstack Browser proxy server running at: http://" + host + ":" + port);
console.log("Browser path: " + basePath);
console.log("Press Control + C to shutdown");
