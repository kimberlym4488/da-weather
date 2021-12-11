var timeDisplayEl = $("#time");
var city = document.querySelector("#city");
var mainText = document.querySelector("#mainText");
var invalidFeedback = document.querySelector(".feedback");
var APIkey = "a059151d000029215400bdaa7965fbc2"
var latitude = '';
var longitude = '';
console.log(mainText);

function displayTime() {
    var now = moment().format('MMMM Do YYYY, h:mm:ss a');
    timeDisplayEl.text(now);
}

setInterval(displayTime, 1000);
var today = moment().format("dddd");


function getWeather(latitude, longitude) {
    // Insert the API url to get a list of weather data
   console.log(`This is my ${longitude} latitude, this is my ${latitude} longitude, this is my ${APIkey} ApiKey. My residence is ${city.value}`)

    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts,minutely,hourly,&units=imperial&appid=a059151d000029215400bdaa7965fbc2`;
    
    fetch(requestUrl)
      .then(async function (response) {
        const data = await response.json();
        printMainContainer(data);
        return;
        //this object contains all the data we requested. 
      })

    } 
     
function printMainContainer(data){
    mainText.textContent = "Happy " + today + "! Here's the weather for " + city.value;

    //Add contents into card
    for (var i = 0; i<data.length; i++) {
        console.log(data[i].current.temp)
   
    var htmlTemplate = 
   `<p>The temperature is ${data[i].current.temp} degrees Fahrenheit.<p>
   <p>The wind speed is ${data[i].current.wind_speed} mph.<p>
   <p>The humidity is ${data[i].current.humidity}.<p>
   <div id="icon"><img id="weatherIcon" src="" alt="Weather icon"></div>`
   $('#currentWeather').append(htmlTemplate);
    //for some reason calling the icon below works to get the icon to append to the div above.
   // was up in htmlTemplate. Testing first. <p>The UV index is ${data.daily[0].uvi}}.<p>
   var weatherIcon = data.current.weather[0].icon;
   var iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
   $("#weatherIcon").attr("src", iconUrl);

   //append string HTML with jQuery
$('#issues').append(htmlTemplate);
    }
    return;
}
function getLatLon(){
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city.value}&appid=a059151d000029215400bdaa7965fbc2`;
    
    fetch(requestUrl)
      .then(async function (response) {
        const data = await response.json();
      //for (var i = 0; i<data.length; i++) {
            console.log(data)
            latitude = data[0].lat;
            longitude = data[0].lon;
            console.log(longitude);
            console.log(latitude);
            getWeather(latitude,longitude);
            return;
        //}
        //can put data here
        
        //this object contains all the data we requested. SHould we have a fail safe if it doesn't work, like try your zip code?
      })
      //.then(function (data) {
    //move data back
          //not doing for loop on main content, only showing one city.

     //   })
      };

function buttonClickHandler(event){
    event.preventDefault();
//If nothing is entered, alert pops up to enter a search term.
        if (city.value==='') {
          invalidFeedback.innerHTML = "Please enter a valid city."
            return;
        } 
        else {
            getLatLon(city.value);
        }
}

document.getElementById('btn').addEventListener("click", buttonClickHandler);
  