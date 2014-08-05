// app.js

var express = require("express");
// var db = require("./models/index.js");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');

app.get('/home', function(req, res){
	res.render('home')
})

app.get('/events', function(req, res){
	res.render('events')
})

app.get('/signup', function(req, res){
	res.render('signup')
})

app.get('/login', function(req, res){
	res.render('login')
})

app.get('/search', function(req, res){
	var area = req.query.area;
	var radius = req.query.radius;
	var date = req.query.date;

	var url = "http://api.bandsintown.com/events/search?location="+ area +"&radius="+radius+"&date="+date+"&format=json&app_id=SWAG_LIST";

	console.log("Url" + url)
	console.log(date)

	request(url, function(error, response, body){
		if(!error){
			var body = JSON.parse(body);
			// var artist = body.Events.artist;
			console.log(body)
			res.render('results', {eventsList: body, date: date})
		}
	})
})

app.listen(3000, function(){
  console.log("SERVER listening on 3000")
})
