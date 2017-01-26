/* function which will get stream status from TWITCH API

YES, TWITCH API
Kappa

#PAPUT
*/

// function which getting information from TWTICH API
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
	    //error control - renderStatus("response: "+response);

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

document.addEventListener('DOMContentLoaded', function() {
	
	//checking stream status in twitch API - big function - START
	getTwitchStreamStatus(function(streamTitle, streamGame, streamLiveViewers, streamLiveDate, streamPreviewMedium) {

	  var status = document.getElementById('status');
	  var dateNowTimestamp = new Date();
	  var streamStartDateTimestamp = new Date(streamLiveDate);

	  var streamDuring = dateNowTimestamp - streamStartDateTimestamp;

	  //TO DO: function do this - form multiple uses
	  if(streamDuring > 0){
	  	var seconds = (streamDuring/1000)%60;
	  	var minutes = ((streamDuring-seconds)/1000)/60;

	  	var outputTime = "";

	  	var intMinutes = parseInt(minutes);
	  	var intSeconds = parseInt(seconds);

	  	if(minutes == 1){
	  		outputTime = intMinutes+"minuty ";
	  		if(seconds > 1){
	  			outputTime += intSeconds+"sekund";
	  		}
	  		else if(seconds == 1){
	  			outputTime += intSeconds+"sekundy";
	  		}
	  	}
	  	else if(minutes == 0){
	  		outputTime = intSeconds+"sekund";
	  	}
	  	else{
	  		outputTime = intMinutes+"minut ";
	  		if(seconds > 1){
	  			outputTime += intSeconds+"sekund";
	  		}
	  		else if(seconds == 1){
	  			outputTime += intSeconds+"sekundy";
	  		}
	  	}
	  }
	  else{
	  	showInfo("error");
	  	errorCallback('Time error 1');
	  }

	  	chrome.browserAction.setIcon({path: "icons/icon_1.png"});
	  	chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
 		chrome.browserAction.setBadgeText({text:"ON"});

		status.innerHTML = "<p class='handler__text'>Tytuł streama: "+streamTitle+"</p><p class='handler__text'>Gra: "+streamGame+"</p><p class='handler__text'> Bynie online: <span class='handler__text-live'>"+streamLiveViewers+"</span></p><p class='handler__text'>Live trwa od: "+outputTime+"</p><a href='https://twitch.tv/pago3/' target='_blank' class='handler__text__stream text-xs-center'><img src='"+streamPreviewMedium+"'/></a><a href='https://twitch.tv/pago3' target='_blank' class='handler__text-button-watch'>Oglądaj bynia!</a>";
	},
	function(streamOff){
		var status = document.getElementById('status');

		chrome.browserAction.setIcon({path: "icons/dead_glitch.png"});
		chrome.browserAction.setBadgeText({text: ''});

		status.innerHTML = "<p class='handler__text text-xs-center'>"+streamOff+"</p><img src='icons/dead_glitch.png' class='image-center'/><p class='handler__text'>Sprawdź co na naszej grupie: <a href='https://www.facebook.com/groups/1721694058053294/' target='_blank'>Bynie Pągowskiego</a></p>";
	},
	function(errorMessage){
		showInfo("error");
		renderStatus('Cannot display information. ' + errorMessage);
	});
	//checking stream status in twitch API - big function - END

	//showing/hiding options
	document.getElementById("gear").addEventListener("click", function(){
		var divOptions = document.getElementById("options");
		var classList = divOptions.className.split(/\s+/);

		if(classList[1] == "none"){
			divOptions.className = divOptions.className.replace(/\bnone\b/,'');
		}
		else{
			divOptions.className += "none";
		}
	});

	//range - options
	document.getElementById("range").addEventListener("mousemove", function(){
		rangeOptions("range","rangeValue","min");
	});
	document.getElementById("volume").addEventListener("mousemove", function(){
		rangeOptions("volume","volumeValue","%");
	});

	//setting timeout time of call twitch api - options
	document.getElementById("timeout").addEventListener("click", function(){
		var timeout = document.getElementById("timeout");
		var range = document.getElementById("range");
		var rangeValue = document.getElementById("rangeValue");

		var valueCheckbox = timeout.checked;

		if(valueCheckbox == true){
			timeout.checked = true;
			range.disabled = false;
			range.value = 60;
			rangeValue.innerHTML = "60min";
		}
		else{
			range.disabled = true;
			rangeValue.innerHTML = "Opcja wyłaczona";
		}
	});

	//setting volume height of audio alert - options
	document.getElementById("voiceAlert").addEventListener("click",function(){
		var voiceAlert = document.getElementById("voiceAlert");
		var volume = document.getElementById("volume");
		var volumeValue = document.getElementById("volumeValue");

		var valueCheckbox = voiceAlert.checked;

		if(valueCheckbox == true){
			voiceAlert.checked = true;
			volume.disabled = false;
			volume.value = 50;
			volumeValue.innerHTML = "50%";
		}
		else{
			volume.disabled = true;
			volumeValue.innerHTML = "Opcja wyłaczona";
		}
	});

	//saving options into localStorage - START
	var arrayValues = new Array();
	document.getElementById("saveFunctions").addEventListener("click", function(){
		arrayValues = [];
		var timeoutCheckboxValue = document.getElementById("timeout").checked;
		var voiceAlertCheckboxValue = document.getElementById("voiceAlert").checked;
		var chromeAlertCheckboxValue = document.getElementById("chromeAlert").checked;

			arrayValues.push(timeoutCheckboxValue);
		pushToLocalStorage(timeoutCheckboxValue,"range");

			arrayValues.push(voiceAlertCheckboxValue);
		pushToLocalStorage(voiceAlertCheckboxValue,"volume");

			arrayValues.push(chromeAlertCheckboxValue);

		var jsonArray = JSON.stringify(arrayValues);

		chrome.storage.sync.set({
			"options":jsonArray
		},function(){
			showInfo("success");
		});
	});

	//getting options from localStorage - START
	function getOptions(){
		chrome.storage.sync.get([
			"options"
		],function(items){
			var itemsArray = JSON.parse(items.options);

			//DOM elements - START
			var timeout = document.getElementById("timeout");
			var range = document.getElementById("range");
			var rangeValue = document.getElementById("rangeValue");

			var voiceAlert = document.getElementById("voiceAlert");
			var volume = document.getElementById("volume");
			var volumeValue = document.getElementById("volumeValue");
			
			var chromeAlert = document.getElementById("chromeAlert");
			//DOM elements - END

			if(itemsArray.length == 5){
				if(itemsArray[0] === false && itemsArray[1] === false){
					timeout.checked = itemsArray[0];
					range.disabled = true;
					rangeValue.innerHTML = "Opcja wyłaczona";
				}
				else{
					timeout.checked = itemsArray[0];
					range.disabled = false;
					range.value = itemsArray[1];
					rangeValue.innerHTML = itemsArray[1]+" minut";
				}

				if(itemsArray[2] === false && itemsArray[3] === false){
					voiceAlert.checked = itemsArray[2];
					volume.disabled = true;
					volumeValue.innerHTML = "Opcja wyłaczona";
				}
				else{
					voiceAlert.checked = itemsArray[2];
					volume.disabled = false;
					volume.value = itemsArray[3];
					volumeValue.innerHTML = itemsArray[3]+"%";
				}

				if(itemsArray[4] === false){
					chromeAlert.checked = itemsArray[4];
				}
				else{
					chromeAlert.checked = itemsArray[4];
				}
			}
			else{
				timeout.checked = true;
				range.disabled = false;
				range.value = 60;
				rangeValue.innerHTML = "60 minut";

				voiceAlert.checked = true;
				volume.disabled = false;
				volume.value = 50;
				volumeValue.innerHTML = "50%";

				chromeAlert.checked = true;
			}
		});
	}
	getOptions();
	//end getting options from localStorage - END
	//end saving options into localStorage - END

	//range - options - function - START
	function rangeOptions(idRange, idReturnedValue, unit){
		var value = document.getElementById(idRange).value;
		document.getElementById(idReturnedValue).innerHTML = value+unit;
	}
	//range - options - function - END

	//values - push to array - function - START
	function pushToLocalStorage(booleanVar, idRange){
		if(booleanVar === true){
			var rangeValue = document.getElementById(idRange).value;

			arrayValues.push(rangeValue);
		}
		else{
			arrayValues.push(false);
		}
	}
	//values - push to array - function - END

	//showing success/error popup - START
	function showInfo(whichInfo){
		if(whichInfo == "success"){
			var popup = document.getElementById("success");
		}
		else if(whichInfo == "error"){
			var popup = document.getElementById("error");
		}

		var classList = popup.className.split(/\s+/);

		if(classList[1] == "hidden-popup"){
			popup.className = popup.className.replace(/\bhidden-popup\b/,'');
		}

		setTimeout(function(){
			hideInfo(whichInfo);
		},2000);
	}

	function hideInfo(whichInfoToHide) {
		if(whichInfoToHide == "success"){
			var popup = document.getElementById("success");
		}
		else if(whichInfoToHide == "error"){
			var popup = document.getElementById("error");
		}

		var classList = popup.className.split(/\s+/);

		if(classList[1] != "hidden-popup"){
			popup.className += "hidden-popup";
		}
	}
	//showing success/error popup - END

	//hiding success/error popup onClick event - START
	document.getElementById('success').addEventListener('click',function(){
		hideInfo('success');
	});

	document.getElementById('error').addEventListener('click',function(){
		hideInfo('error');
	});
	//hiding success/error popup onClick event - END

	//pause audio play when user clicked on icon - by getting values from background.js
	var backgroundPage = chrome.extension.getBackgroundPage();
	if(typeof backgroundPage.audio != "undefined"){
 		backgroundPage.audio.pause();
 	}
});

/****

TO DO:
1) nottifications in toolbar chrome - TO TEST
2) ADD option with live iframe instead of img from stream + options with autoplay and choose between img/iframe
3) ADD bug report to ticket on github
4) ADD youtube the newest movie and show it with link && title instead fb group (refreshing more times)

****/