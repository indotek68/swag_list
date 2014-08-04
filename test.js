// test.js

var express = require("express");
// var db = require("./models/index.js");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');

// app.get('/',function(req, res){
// 	var url = "http://api.jambase.com/events?artistId=2698&zipCode=95128&radius=50&startDate=2014-08-04&page=0&api_key=dwa8856tnfz4v2d55nye56xg"
// 	console.log(url)

// 	request(url, function(error, response, body){
// 		if(!error){
// 			var body = JSON.parse(body);
// 			console.log(url)
// 			res.render('results')
// 		}
// 	})
// })

app.get('/search', function(req, res){
  var query = req.query.searchTerm;
  var url = "http://www.omdbapi.com/?s=" + query;
  console.log(url)

  request(url, function(error, response, body){
  	if(!error){
  		var body = JSON.parse(body);
  		res.render('results', {movieList: body.Search});
  	}
  });
});
