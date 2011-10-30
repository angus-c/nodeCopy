var http = require("http");
var url = require("url");
var fs = require('fs');

var port = 8080;
var respContent = "";

var fromPath = '/Users/fred/Documents'
var toPath = '/Users/fred/Dropbox/Documents'
var filename;

http.createServer(function (request, response) {

  /************dispatch function**************/
  (function(pathname) {
    if (pathname.match("favicon")) { return; }
    //list files...
    if (pathname == "/") {
      listDirectory();
      return;
    }
    //...or copy
    filename = pathname;
    respNew("<span>asked to copy", pathname, "...</span>");
  	fs.readFile(fromPath + pathname, copyData);
  })(unescape(url.parse(request.url).pathname));
  /********************************************/

  function copyData(err, data) {
    err || fs.writeFile(toPath + filename, data);
    respAdd(err || ["copied", filename, "to", toPath].join(" "));
    respAdd("<a href='/'>copy another?</a>");
    serveResponse(err);
  }

  function listDirectory(err, data) {
    fs.readdir(fromPath, function(err, files) {
      respNew("<span>Copy from", "<code>" + fromPath + "</code><br>to<code>" + toPath + "</code><br>");
      respAdd(files.map(function(e) {
        return ["<a href='", "/", e, "'>", e, "</a>"].join('');
      }).join('<br>'));
      serveResponse(err);
    })
  }

  function serveResponse(err) {
    response.writeHead(err ? 400 : 200, {
      "Content-Type": "text/html"
    });
    response.write(respContent);
    response.end();
  }

  function respAdd(/*arguments*/) {
    respContent += ("<br>" + [].slice.call(arguments).join(" "));
  }

  function respNew(/*arguments*/) {
    respContent = ("<br>" + [].slice.call(arguments).join(" "));
  }

}).listen(port);

console.log("awaiting instructions at localhost:8080...");
