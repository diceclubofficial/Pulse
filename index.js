'use strict'
let http = require('http');
let url = require('url');
let fs = require('fs');
let formidable = require('formidable');


// Create a server object
http.createServer( function(req, res) {
  let query = url.parse(req.url, true); // Translates request into url object

  // Directs blank requests to the homepage
  let filename = query.pathname.length > 1 ? "." + query.pathname : "./index.html";
  // determines MIME type from extension
  let type = getContentType(filename);

  fs.readFile(filename, function(err, data) {
    // Error handling
    if (err) {
      res.writeHead(404, {'Content-Type' : 'text/html'});
      return res.end("404 Not Found.");
    }
    // Response header according to MIME type of the requested file
  	res.writeHead(200, {'Content-Type': type});
    res.write(data);
    res.end();

  });

}).listen(8080); // Server object listens on port 8080


function getContentType(filename) { // Returns MIME type given file name by analyzing the extension
  let extension = filename.substring(filename.lastIndexOf('.')+1, filename.length);
  switch(extension) {
    case 'html':
      return 'text/html';
    case 'js':
      return 'text/javascript';
    case 'css':
      return 'text/css';
    case 'mp4':
      return 'audio/mp4';
    case 'mp3':
      return 'audio/mp3';
    default:
      return 'text/plain';
  }
}
