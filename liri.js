//this loads the values from the .env file into my application's process.env
require("dotenv").config();

//storing dependencies in vars. Required to run functions
var request = require("request");
//fs package to handle read/write
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api'); // or just spotify
var omdb = require ('omdb'); //we are supposed to use request to call omdb????

//
var userChoice = process.argv[2];
var secondChoice = process.argv[3];


// User choices for this liri app
function liriCommands(cmd, param) {
    switch (cmd) {
    //TO INPUT TWITTER ACCOUNT INFORMATION.
        case "my-tweets": myTweets(); break;
    //VALIDATE SONG STRING BEFORE PASSING TO FUNCTION.
        case "spotify-this-song": spotifyThis(param); break;
    //VALIDATE MOVIE STRING BEFORE PASSING TO FUNCTION.
        case "movie-this": movieThis(param); break;
    //adds somenthing to the function
        case "do-what-it-says": doWhatItSays(); break;
        default:
            console.log(first_argv + " : command not found");
    }
}
//this block of code is based on the code block from mpm
function getTweets(){
	console.log("Tweets out!");
	//new variable for instance of twitter, load keys from imported keys.js
	var client = new twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});
//parameters for twitter function.
	var parameters = {
		screen_name: 'multishifties',
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

function getSpotify(){
	console.log("Music Fun");

	//variable for search term, test if defined.
	var searchTrack;
	if(secondCommand === undefined){
		searchTrack = "What's that?";
	}else{
		searchTrack = secondCommand;
	}
	//launch spotify search. This is from npm
	spotify.search({type:'track', query:searchTrack}, function(err,data){
	    if(err){
	        console.log('Error occurred: ' + err);
	        return;
	    }else{
	  		  console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Album: " + data.tracks.items[0].album.name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
    //where is the default song, if no song is provided?
	    }
	});
};

function getMovie(){
	console.log("Netflix and Chill?");

	//same as above, test if search term entered
	var searchMovie;
	if(secondCommand === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = secondCommand;
	};
//we are suppose to use request to get info from omdb.
//request ()
	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=long&tomatoes=true&r=json';
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
          console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
          //?console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	     }
    });
};

function getTexFile(){
	console.log("Looking at random.txt now");
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{
//missing the prompt "Haven't whatched it? It's on Netflix!"
     	//split data, declare variables
     	var dataArr = data.split(',');
        userCommand = dataArr[0];
        secondCommand = dataArr[1];
        //if multi-word search term, add.
        for(i=2; i<dataArr.length; i++){
            secondCommand = secondCommand + "+" + dataArr[i];
        };
        //run action
		theGreatSwitch();
    	};
    });
};

//where is the new Twitter line.

/*
// Then run a request to the OMDB API
request("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
  }
});
*/
