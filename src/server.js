var http = require("http");
var sys = require("sys");
var url = require("url");
var fs = require('fs');
var mustache = require('mustache');

var invalidFileName = /favicon|^$/;
var pathQuery = /to|from/;

var port = 8080;
var respContent = "";

var data = {
  fromPath: '/Users/fred/Documents/',
  toPath: '/Users/fred/Dropbox/Documents/'
}
var filename;

http.createServer(function (request, response) {

  /************dispatch request**************/
  (function(urlObj) {

    //load css
    if (urlObj.pathname.match(/\.css$/)) {
      upload(urlObj.pathname.slice(1), 'text/css');
      return;
    }

    //load js
    if (urlObj.pathname.match(/\.js$/)) {
      upload(urlObj.pathname.slice(1), 'text/javascript');
      return;
    }

    //change to path
    if (urlObj.query.to) {
      data.toPath = unescape(urlObj.query.to);
    }

    //change from path
    if (urlObj.query.from) {
      data.fromPath = unescape(urlObj.query.from);
    }

    //copy file
    if (urlObj.query.file && !urlObj.query.file.match(invalidFileName)) {
      filename = urlObj.query.file;
      console.log('from' + data.fromPath + filename);
      fs.readFile(data.fromPath + filename, copyData);
      return;
    }

    //no other action - prompt for copy
    data.message = "select a file to copy";
    renderTemplate();

  })(url.parse(request.url, true));
  /********************************************/

  function renderTemplate() {
    response.writeHead(200, {'Content-Type': 'text/html'});
      fs.readFile("index.html", 'utf-8', function(err, content) {
        if (!err) {
          data.files = fs.readdirSync(data.fromPath);
          respContent = mustache.to_html(content, data);
        }
      serveResponse(err);
    });
  }

  function upload(path, type) {
    response.writeHead(200, {'Content-Type': type});
    var fileStream = fs.createReadStream(path);
    fileStream.pipe(response);
  }

  function copyData(err, content) {
    err || fs.writeFile(data.toPath + filename, content);
    console.log('to' + data.toPath + filename);
    data.message = err || ["copied", filename, '('+content.length+' bytes)', "to", data.toPath].join(" ");
    renderTemplate();
  }

  function serveResponse(err) {
    response.writeHead(err ? 400 : 200, {
      "Content-Type": "text/html"
    });
    response.write(respContent);
    response.end();
  }
}).listen(port);

console.log("awaiting instructions at localhost:" + port + "...");
