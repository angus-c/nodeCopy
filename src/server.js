var http = require("http");
var url = require("url");
var fs = require('fs');

var port = 8080;
var respContent = "";

var fromPath = '/Users/fred/Documents'
var toPath = '/Users/fred/Dropbox/Documents'
var name;


http.createServer(function (request, response) {

  name = unescape(url.parse(request.url).pathname);
  if (name.match("favicon")) { return; }

  respLn();
  respLn("asked to copy", name, "...");

	fs.readFile(fromPath + name, copyData);

  function copyData(err, data) {
    err || fs.writeFile(toPath + name, data);
    respLn(err || ["copied", name, "to", toPath].join(" "));
    serveResponse(err);
  }

  function serveResponse(err) {
    response.writeHead(err ? 400 : 200, {
      "Content-Type": "text/plain"
    });
    response.write(respContent);
    response.end();
  }

  function respLn(content) {
    respContent += ("\n" + [].slice.call(arguments).join(" "));
  }

}).listen(port);
