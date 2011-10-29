var http = require("http");
var url = require("url");
var fs = require('fs');

var port = 8080;
var respContent = "";

var fromPath = '/Users/fred/Documents'
var toPath = '/Users/fred/Dropbox/Documents'
var name;


http.createServer(function (request, response) {

  /************dispatch function**************/
  (function(name) {
    if (name.match("favicon")) { return; }

    //list files...
    if (name == "/") {
      listDirectory();
      return;
    }

    //...or copy
    respLn("\nasked to copy", name, "...");
    fs.readFile(fromPath + name, copyData);
  })(unescape(url.parse(request.url).pathname));
  /********************************************/

  function copyData(err, data) {
    err || fs.writeFile(toPath + name, data);
    respLn(err || ["copied", name, "to", toPath].join(" "));
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
