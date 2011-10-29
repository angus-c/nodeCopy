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
    respLn("\nasked to copy", pathname, "...");
  	fs.readFile(fromPath + pathname, copyData);
  })(unescape(url.parse(request.url).pathname));
  /********************************************/

  function copyData(err, data) {
    err || fs.writeFile(toPath + filename, data);
    respLn(err || ["copied", filename, "to", toPath].join(" "));
    serveResponse(err);
  }

  function listDirectory(err, data) {
    fs.readdir(toPath, function(err, files) {
      respLn("\nchoose a file to copy...\n");
      respLn(files.join('\n'));
      serveResponse(err);
    })
  }

  function serveResponse(err) {
    response.writeHead(err ? 400 : 200, {
      "Content-Type": "text/plain"
    });
    response.write(respContent);
    response.end();
  }

  function respLn(/*arguments*/) {
    respContent += ("\n" + [].slice.call(arguments).join(" "));
  }

}).listen(port);

console.log("awaiting instructions at localhost:8080...");
