// app.js

var express = require("express");
// var db = require("./models/index.js");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');

app.get('/',function(req, res){
	var zip = req.query.zip;
	var radius = req.query.date;
	console.log(req.query.searchTerm)
	var url = "http://api.jambase.com/events?zipCode=95128&radius=50&startDate=2014-08-04&page=0&api_key=dwa8856tnfz4v2d55nye56xg"
	console.log(url)

	request(url, function(error, response, body){
		if(!error){
			var body = JSON.parse(body);
			console.log(url)
			res.render('results')
		}
	})
})

app.listen(3000, function(){
  console.log("SERVER listening on 3000")
})
