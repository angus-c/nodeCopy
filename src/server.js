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
    //list files...
    if (pathname == "/") {
      response.writeHead(200, {'Content-Type': 'text/html'});
        fs.readFile("index.html", 'utf-8', function(err, content) {
        respContent = err ||
          mustache.to_html(content, {
            fromPath: fromPath,
            toPath: toPath,
            files: fs.readdirSync(fromPath),
          });
        serveResponse(err);
      });

      //listDirectory();
      return;
    }

    if (pathname.match(/\.css$/)) {
      response.writeHead(200, {'Content-Type': 'text/css'});
      var fileStream = fs.createReadStream(pathname.slice(1));
      fileStream.pipe(response);
      return;
    }

    if (pathname.match(/favicon/)) { return; }
    //...or copy
    filename = pathname;
    respNew("<span>asked to copy", pathname, "...</span>");
    fs.readFile(fromPath + pathname, copyData);
  })(unescape(url.parse(request.url).pathname));
  /********************************************/

  function copyData(err, data) {
    err || fs.writeFile(toPath + filename, data);
    respAdd(err || ["copied", filename, '('+data.length+' bytes)', "to", toPath].join(" "));
    respAdd("<a href='/'>copy another?</a>");
    serveResponse(err);
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
