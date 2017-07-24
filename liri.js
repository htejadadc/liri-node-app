var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

var cKey = keys.twitterKeys.consumer_key
var cSecret = keys.twitterKeys.consumer_secret;
var atKey = keys.twitterKeys.access_token_key;
var atSecret = keys.twitterKeys.access_token_secret;
var clientId = keys.spotifyKeys.client_id;
var clientSecret = keys.spotifyKeys.client_secret;

var liriCommands = process.argv[2];
var nodeArg = process.argv;
var target = "";

for (var k = 3; k < nodeArg.length; k++) {
	target = target + nodeArg[k] + " ";
}
 
var client = new Twitter({
	consumer_key: cKey,
	consumer_secret: cSecret,
	access_token_key: atKey,
	access_token_secret: atSecret
});

var spotify = new Spotify({
	id: clientId,
	secret: clientSecret
});

function liriRequest(commandEntry, target) {
	if (commandEntry === "my-tweets") {
		client.get("statuses/user_timeline", {screen_name: "RobertoBellarm3", count: 20}, function(error, tweets, response) {
			if (!error) {
				for (var i = 0; i < tweets.length; i++) {
					console.log("\n------------\n" + tweets[i].text + "\nCreated at: " + tweets[i].created_at);
				}
			}
		});

	} else if (commandEntry === "spotify-this-song") {
		if (!target) {			
			spotify.search({type: "track", query: "The Sign", limit: 20}, function(err, data) {
				if (err) {
					return console.log('Error occurred: ' + err);
				}					
				console.log("\n------------" + "\nArtist(s): " + data.tracks.items[6].artists[0].name + 
					"\nSong's Name: " + data.tracks.items[6].name + 
					"\nPreview Link: " + data.tracks.items[6].preview_url +
					"\nAlbum Name: " + data.tracks.items[6].album.name);				
			});

		} else {
			spotify.search({type: "track", query: target, limit: 5}, function(err, data) {
				if (err) {
					return console.log('Error occurred: ' + err);
				}		
				for (var j = 0; j < data.tracks.items.length; j++) {
					console.log("\n------------" + "\nArtist(s): " + data.tracks.items[j].artists[0].name + 
						"\nSong's Name: " + data.tracks.items[j].name + 
						"\nPreview Link: " + data.tracks.items[j].preview_url +
						"\nAlbum Name: " + data.tracks.items[j].album.name);
				}
			});
		}

	} else if (commandEntry === "movie-this") {		
		if (!target) {		
			target = "Mr.Nobody"
			var url = "http://www.omdbapi.com/?t=" + target + "&y=&plot=short&apikey=40e9cece";
			
		} else {
			var url = "http://www.omdbapi.com/?t=" + target + "&y=&plot=short&apikey=40e9cece";			
		}

		request(url, function(error, response, body) {
			  
			if (!error && response.statusCode === 200) {    
				console.log("\n------------" + "\nTitle of the Movie: " + JSON.parse(body).Title + 
					"\nYear the Movie came out: " + JSON.parse(body).Year + 
					"\nIMDB Rating of the Movie: " + (JSON.parse(body)).Ratings[0].Value + 
					"\nRotten Tomatoes Rating of the movie: " + (JSON.parse(body)).Ratings[1].Value + 
					"\nCountry where the Movie was produced: " + JSON.parse(body).Country + 
					"\nLanguage of the Movie: " + JSON.parse(body).Language + 
					"\nPlot of the Movie: " + JSON.parse(body).Plot + 
					"\nActors in the movie: " + JSON.parse(body).Actors + "\n------------\n");  				 
			} 
		});

	} else if (commandEntry === "do-what-it-says") {	

		fs.readFile("random.txt", "utf8", function(error, data) {  
		  if (error) {
		    return console.log(error);
		  }		  
		    
		  var dataArray = data.split(",");		
		  liriRequest(dataArray[0], dataArray[1]);

		});
	}
};

liriRequest(liriCommands, target);

 

 

