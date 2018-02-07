//this loads the values from the .env file into my application's process.env
require("dotenv").config();

//storing dependencies in vars. Required to run functions
var request = require("request");
//fs package to handle read/write
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api'); 


var cmd = process.argv[2];
var param = process.argv[3];

//liriCommands();

// User choices for this liri app
function liriCommands(cmd, param) {
    switch (cmd) {
    //TO INPUT TWITTER ACCOUNT INFORMATION.
        case "my-tweets": 
        getTweets(); 
        break;
    //VALIDATE SONG STRING BEFORE PASSING TO FUNCTION.
        case "spotify-this-song": 
        getSpotify(param);
    //couldnt make the default code work w/ the rest of the code
        /*if(param){getSpotify(param)}
        else{getSpotify("The Sign")}; */
    	break;
    //VALIDATE MOVIE STRING BEFORE PASSING TO FUNCTION.
        case "movie-this": 
        getMovie(param); 
        break;
    //adds somenthing
        case "do-what-it-says": 
        doWhatItSays(); 
        break;
        default:
            console.log(cmd + " : command not found");
    }
}
//this block of code is based on the code block from npm
function getTweets(){
	console.log("Tweets out!");
//new variable for instance of twitter, load keys from imported keys.js
	var client = new Twitter(keys.twitter);
//parameters for twitter function.
	var parameters = { 
		screen_name: 'Soraia Rdab',
		count: 20
	};
//call the get method on our client variable twitter instance
	client.get('statuses/user_timeline', parameters, function(error, tweets, response){
		if (!error) {
	        for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
	        }
	    };
	});
};
// using node-spotify-api code from npm
function getSpotify(){
	console.log("Music Me");
	//variable for search term, loads keys.
 	var spotify = new Spotify(keys.spotify);
	spotify.search({ type: 'track', query: "One" }, function(error, data) {

  if (err) {
    return console.log('Error occurred: ' + err);
  }
 			console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
	        console.log("Album: " + data.tracks.items[0].album.name);
	    }
	});


function getMovie(){ //(moviename)
	console.log("Enter Movie");

	var searchMovie;
	if(param === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = param;
	};
	//missing the prompt "Haven't whatched it? It's on Netflix!"
//request (). This doesnt seem to work.
	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=long&tomatoes=true&r=json';
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	     }
    });
};

function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{
     	//split data, declare variables
     	var dataArr = data.split(',');
        cmd = dataArr[0];
       param = dataArr[1];
        //if multi-word search term, add.
        for(i=2; i<dataArr.length; i++){
            param = param + "+" + dataArr[i];
        };
        
		liriCommands();
    	};
    });
};
	liriCommands();
