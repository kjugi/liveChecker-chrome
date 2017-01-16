/* function which will get stream status from TWITCH API

YES, TWITCH API
Kappa

#PAPUT
*/

//variable to playing PAGO audio - łapki w góre
var oneMoreTimeHomie = true, audio, volumeLevelDecimal;

function getTwitchStreamStatus(streamOn, streamOff, errorCallback){
	//one streamer extension PAGO3
	//demo mode: on
	//https://api.twitch.tv/kraken/streams/40378922?client_id=dlw882cebptkltr33a4s0ejzongxfg
	var streamerID = "40378922";
	var client_id = "dlw882cebptkltr33a4s0ejzongxfg";
	var url = "https://api.twitch.tv/kraken/streams/";
  	var data = null;

	var xhr = new XMLHttpRequest();

	xhr.open("GET", url+streamerID);
	xhr.setRequestHeader("accept", "application/vnd.twitchtv.v5+json");
	xhr.setRequestHeader("client-id", client_id);
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

  	xhr.onload = function() {
	    var response = JSON.parse(xhr.responseText);

	    if (!response) {
	      showInfo("error");
	      errorCallback('No response from TWITCH API!');
	      return;
	    }

	    if(response.stream != null){
		    var streamTitle = response.stream.channel.status;
		    var streamGame = response.stream.game;
		    var streamLiveViewers = response.stream.viewers;
		    var streamLiveDate = response.stream.created_at;
		    var streamPreviewMedium = response.stream.preview.medium;

		    console.assert(
		        typeof response == 'object', 'Unexpected response from the TWITCH API!');

		    streamOn(streamTitle, streamGame, streamLiveViewers, streamLiveDate, streamPreviewMedium);
		}
		else{
			var streamNull = "Brak streama!";

			console.assert(
				typeof response == 'object', 'Unexpected response from the TWITCH API!');

			streamOff(streamNull);
		}
	};
	xhr.onerror = function() {
		showInfo("error");
	    errorCallback('Network error.');
	};
	xhr.send(data);
}

//checking on welcome if stream is live function - START
function checkLiveStream(){
	getTwitchStreamStatus(function(streamTitle, streamGame, streamLiveViewers, streamLiveDate, streamPreviewMedium) {
		chrome.browserAction.setIcon({path: "icons/icon_1.png"});
		chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
 		chrome.browserAction.setBadgeText({text:"ON"});

 		//start audio play - only when stream start
 		playMusic(volumeLevelDecimal);
	},
	function(streamOff){
		chrome.browserAction.setIcon({path: "icons/icon_default.png"});
		chrome.browserAction.setBadgeText({text: ''});

		//to play again when stream went on
		oneMoreTimeHomie = true;
	},
	function(errorMessage) {
		showInfo("error");
	  	console.log('Cannot display information. ' + errorMessage);
	});
}
checkLiveStream();
//checking on welcome if stream is live function - END

//getting localStorage - START
function getOptions(){
	chrome.storage.sync.get([
		"options"
	],function(items){
		if(typeof items.options == "undefined"){
			setDefaultFirstOptions();
		}
		else{
			var itemsArray = JSON.parse(items.options);
			var miliseconds, interval, volumeLevelPercent;

			if(itemsArray.length == 4){
				if(itemsArray[0] === false && itemsArray[1] === false){
					miliseconds = 0;
					clearInterval(interval);
				}
				else{
					clearInterval(interval);
					miliseconds = itemsArray[1] * 60000;
					interval = setInterval(checkLiveStream, miliseconds);
				}

				if(itemsArray[2] != false && itemsArray[3] != false){
					volumeLevelPercent = itemsArray[3];
					volumeLevelDecimal = itemsArray[3] * 0.01;
				}
			}
			else{
				clearInterval(interval);
				miliseconds = 3600000;
				interval = setInterval(checkLiveStream,miliseconds);

				volumeLevelDecimal = 0.5;
			}
		}
	});
}
getOptions();
//getting localStorage - END

//checking localStorage on change [new click on save button in options]
chrome.storage.onChanged.addListener(function(){
	getOptions();
});

//setting first default options - ONLY ON FIRST RUN
function setDefaultFirstOptions(){
	var arrayValues = [true,'50'];
	var jsonArray = JSON.stringify(arrayValues);

	chrome.storage.sync.set({
		"options":jsonArray
	});

	getOptions();
}

//start audio play - only when stream starts
function playMusic(volumeLevel){
	if(typeof volumeLevel != "undefined"){
		if(oneMoreTimeHomie == true){
			audio = new Audio('audio/pago_lapki_w_gore.mp3');
			audio.volume = volumeLevel;
			audio.play();
		}
	}

	//to stop playing till the stream will ends
	oneMoreTimeHomie = false;
}

