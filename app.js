// app.js

var express = require("express");
// var db = require("./models/index.js");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
var myListArray = [];


app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');

//splash page
app.get('/', function(req, res){
	res.render('splash')
});

//search
app.get('/search', function(req, res){
	res.render('search')
});

//signup
app.get('/signup', function(req, res){
	res.render('signup')
});

//login
app.get('/login', function(req, res){
	res.render('login')
});

//find this works with the api to request the url and sends body to results.ejs
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

//event page, shows detailed info of a single event
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
					// console.log(event.datetime.toString())
					res.render('event', {eventsList: event})
					console.log(event)
				}
				else{
					console.log("NO MATCHES!")
				}
				
			})
		}
	})
})

app.post("/mylist", function(req, res){
	var event = req.body.myList;
	console.log(event)

	res.redirect("/myList")
})

app.get("/mylist", function(render, res){
	res.render("mylist", {mylist: myListArray})
})

app.listen(3000, function(){
  console.log("SERVER listening on 3000")
})









