'use strict';
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const urlShortener = require('./models/urlShortener');
const validateUrl = require('./validateUrl');
const bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
// Basic Configuration 
var port = process.env.PORT || 3000;
/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
app.use(cors());
/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', function (req, res) {
  const newLongUrl = req.body.url;
  validateUrl.validate(newLongUrl, function (err, url) {
    if (err) {
      console.error("Error: Url didn't validate:");
      console.error(err);      
      // {"error":"invalid URL"}
      res.json({error: 'invalid url'});      
    } else {      
      urlShortener.createNew(url, function(err, shortUrl) {
        if (err) {
          console.error('Error: fail with database');
          console.error(err);
          res.send('Error with database.');
        } else {
          // {"original_url":"www.google.com","short_url":1}
          res.json({original_url: url, short_url: shortUrl});
        }
      });
    }
  });
});

app.get('/api/shorturl/:url', function(req, res){
  urlShortener.getLongUrl(req.params.url, function(err, data) {
    if (err) {
      res.send('ERROR');
    } else {
      res.redirect(data);
    }
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
