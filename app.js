const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');

const index = fs.readFileSync('./index.html', 'utf-8');
const app = express();

let privateKey; 
let certificate;
let credentials;
if  (fs.existsSync('./certs/ccda.key') && fs.existsSync('./certs/ccda.crt') && fs.existsSync('./certs/ccda.ca-bundle')) {
  privateKey  = fs.readFileSync('./certs/ccda.key', 'utf-8');
  certificate = fs.readFileSync('./certs/ccda.crt', 'utf-8');
  ca = fs.readFileSync('./certs/ccda.ca-bundle', 'utf-8');
  credentials = {key: privateKey, cert: certificate, ca:ca};
}


app.use('/img', express.static('img'));
app.use('/pdfs', express.static('pdfs'));
app.use('/templates', express.static('templates'));

app.get(['/', '/index.html'], (req, res) => {
    res.send(index);
});

app.get('*', (req, res) => {
  res.redirect('/');
});

var httpServer = http.createServer(app);
let httpsServer;
if (credentials) {
  httpsServer = https.createServer(credentials, app);
}

httpServer.listen(80);
if (httpsServer) {
  httpsServer.listen(443);
  console.log('HTTPS and HTTP running...');
}
else console.log('HTTPS server not running...')
