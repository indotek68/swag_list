// app.js


var express = require("express");
var db = require("./models/index.js");
var locus = require('locus');

var request = require("request");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocal = require("passport-local");
var cookieParser = require('cookie-parser');
var cookieSession = require("cookie-session");
var flash = require('connect-flash');

var dateFormat = require('dateformat');

var app = express();
var myListArray = [];

var isCreated = true;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');

//cookie session middleware
app.use(cookieSession({
	secret: 'thisismysecretkey',
	name: 'session with cookie data',
	maxage: 604800000
}));

//get passport started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function(user, done){
	console.log("Serialize just ran");
	done(null, user.id);
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
	if (!req.user){
		res.render('splash', {isAuthenticated: req.isAuthenticated()})
	} else {
		res.redirect('/search');
	}
});

//signup
app.get('/signup', function(req, res){
	if(!req.user){
		console.log("USER " + req.user)
		res.render('signup', {username: "", isAuthenticated: req.isAuthenticated()});
	}
	else{
		res.redirect('/search');
	}
	
});

//sign up post
app.post("/submit", function(req, res){
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;


	db.user.createNewUser(email, username, password, 
		function(err){
			res.render("signup", {message: err.message, username: username, email: email, isAuthenticated: req.isAuthenticated()});
		},
		function(success){
			res.redirect('/login');
		}
	);
});

//login
app.get('/login', function(req, res){
	if(!req.user){
		res.render("login", {message: req.flash('loginMessage'), 
			username:"",
			isAuthenticated: req.isAuthenticated(),
	});
	}
	else{
		res.redirect('/search');
	}
});

app.post('/authenticate', passport.authenticate('local', {
	successRedirect: '/search',
	failureRedirect: '/login',
	failureFlash: true
}));

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

//search
app.get('/search', function(req, res){
	res.render('search', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
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
			var usefulDate = dateFormat(date, "UTC:dddd, mmmm dS, yyyy")
			//console.log(body)
			res.render('results', {eventsList: body, usefulDate: usefulDate, date: date, isAuthenticated: req.isAuthenticated()})
		}
	})
})

//event page, shows detailed info of a single event
app.get('/event/:venueId/:eventId', function(req, res){
	var venueId = req.params.venueId;
	var eventId = req.params.eventId;
	var venueUrl = "http://api.bandsintown.com/venues/" + venueId + "/events.json?app_id=SWAG_LIST"

	request(venueUrl, function(error, response, body){
		if(!error){
			var	body = JSON.parse(body);
						
			body.forEach(function(event){
				//console.log("event " + event.id);
				// res.render("hello")
			// 	console.log("LOOPED ONCE! WTF IS GOING ON?")
				if(event.id === Number(eventId)){

					var usefulDate = dateFormat(event.datetime,"UTC:dddd, mmmm dS, yyyy" )
					//var usefulDate = dateFormat(event.datetime, "fullDate")
					console.log(event.datetime)
					var usefulTime = dateFormat(event.datetime, "UTC:h:MM:ss TT")

					res.render('event', {eventsList: event, isCreated: isCreated, usefulTime: usefulTime, usefulDate: usefulDate, isAuthenticated: req.isAuthenticated()})
					//console.log(event)
				}
				else{
					console.log("NO MATCHES!")
				}
			})
		}
	})
})

app.get("/mylist", function(req, res){

	db.user.find(req.user.id)
		.success(function(userFromDb) {
  // projects will be an array of Project instances with the specified name
  		userFromDb.getEvents().success(function (myEvents) {
  			//console.log("myEvents!!!!!!!!!!!!!!!!!" +  JSON.stringify(myEvents));
  				myEvents.forEach(function(event){
  					
  					var eventId = event.eventId;
  					var venueId = event.show_data;

  					var venueUrl = "http://api.bandsintown.com/venues/" + venueId + "/events.json?app_id=SWAG_LIST";
  					
  					console.log(venueId + " " + eventId )

						request(venueUrl, function(error, response, body){
							if(!error){
						
						myEvents.forEach(function(event){
						console.log("LOOPED ONCE! WTF IS GOING ON?")
							if(event.id === Number(eventId)){

								var usefulDate = dateFormat(event.datetime,"UTC:dddd, mmmm dS, yyyy" );
								var usefulTime = dateFormat(event.datetime, "UTC:h:MM:ss TT");

								res.render('myList', {eventsList: event, usefulTime: usefulTime, usefulDate: usefulDate, isAuthenticated: req.isAuthenticated()})
								//console.log(event)
							}
							else{
								console.log("NO MATCHES!")
							}
						})
					}

				}) 			
  		});
	})
});

app.post("/create", function(req, res){
	var track = JSON.parse(req.body.myList);
	var venueId = track.venue.id
	var venueIdString = venueId.toString();
	// console.log("!!!!!!!!!!!!!!!!!" + venueIdString)
	var eventId = track.id.toString();
	var showDate = track.datetime.toString();

	if(req.user){
		db.event.findOrCreate({eventId: eventId}, {show_data: venueId, show_date: showDate})
			.success(function(show, created){
				// console.log("******************************")
				// console.log("CREATED" + created)
				req.user.addEvent(show).success(function(){
					//console.log("SHOW " +  JSON.stringify(show))
				})
			})
		res.redirect("/myList")
	}	
});



// app.get('*', function(req, res){
// 	res.status(404);
// 	res.render('404')
// })

app.listen(process.env.PORT || 3000, function(){
  console.log("SERVER listening on 3000")
})









