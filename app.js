// app.js

var express = require("express");
var db = require("./models/index.js");

var request = require("request");
var bodyParser = require("body-parser");
// var date = require( 'useful-date' );
// var dateEng = require( 'useful-date/locale/en-US.js' );
var passport = require("passport")
var passportLocal = require("passport-local")
var cookieParser = require('cookie-parser')
var cookieSession = require("cookie-session")
var flash = require('connect-flash')

var app = express();
var myListArray = [];

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');

//cookie session middleware
app.use(cookieSession({
	secret: 'thisismysecretkey',
	name: 'session with cookie data',
	maxage: 36000
}));

//get passport started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function(user, dine){
	console.log("Serialize just ran");
	done(null, user.id)
});

passport.deserializeUser(function(id, done){
	console.log("Deserialized just ran");
	db.user.find({
		where: {
			id: id
		}
	})
	.done(function(error, user){
		done(error, user);
	});
});

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
	if(!req.user){
		res.render('signup', {username: ""});
	}
	else{
		res.redirect('/mylist')
	}
	
});

//sign up post
app.post("/submit", function(req, res){
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;


	db.user.createNewUser(email, username, password, 
		function(err){
			res.render("signup", {message: err.message, username: username});
		},
		function(success){
			res.redirect("/login", {message: success.message});
		}
	);
})

//login
app.get('/login', function(req, res){
	if(!req.user){
		res.render("login", {message: req.flash('loginMessage'), username:""});
	}
	else{
		res.redirect('/mylist')
	}
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
					//console.log(event)
				}
				else{
					//console.log("NO MATCHES!")
				}
				
			})
		}
	})
})

app.get("/mylist", function(render, res){
	res.render("mylist", {
		//rusnt a function to see if the user is authenticated - returns true or false
		isAuthenticate: req.isAuthenticated(),
		myList: myListArray,
		user: req.user
	});
	//console.log(myListArray)
});

app.post("/mylist", function(req, res){
	var event = JSON.parse(req.body.myList);
	console.log(event)

	myListArray.push(event)

	res.redirect("/myList")
})

app.listen(process.env.PORT || 3000, function(){
  console.log("SERVER listening on 3000")
})









