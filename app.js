// app.js

var express = require("express");
// var db = require("./models/index.js");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('splash')
})

app.get('/search', function(req, res){
	res.render('search')
})

app.get('/signup', function(req, res){
	res.render('signup')
})

app.get('/login', function(req, res){
	res.render('login')
})

app.get('/find', function(req, res){
	var area = req.query.area;
	var radius = req.query.radius;
	var date = req.query.date;

	var url = "http://api.bandsintown.com/events/search?location="+ area +"&radius="+radius+"&date="+date+"&format=json&app_id=SWAG_LIST";

	// console.log("Url" + url)
	// console.log(date)

	request(url, function(error, response, body){
		if(!error){
			var body = JSON.parse(body);
			//console.log(body)
			res.render('results', {eventsList: body, date: date})
		}
	})
})

app.get('/event/:venueId/:eventId', function(req, res){
	var venueId = req.params.venueId;
	var eventId = req.params.eventId;
	//console.log("venue " + venueId)
	//using venue events api
	var venueUrl = "http://api.bandsintown.com/venues/" + venueId + "/events.json?app_id=SWAG_LIST"

	request(venueUrl, function(error, response, body){
		if(!error){
			var	body = JSON.parse(body);

			body.forEach(function(event){
				console.log("LOOPED ONCE! WTF IS GOING ON?")

				if(event.id === Number(eventId)){
					res.render('event', {event: event})
					console.log(event)
				}
				else{
					console.log("NO MATCHES!")
				}
				
			})
		}
	})
})

app.listen(3000, function(){
  console.log("SERVER listening on 3000")
})
