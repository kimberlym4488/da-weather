var timeDisplayEl = $("#time");
var city = document.querySelector("#city");
var cities = document.querySelector("#cities");
var mainText = document.querySelector("#mainText");
var fiveDayForecast=document.querySelector("#fiveDayForecast")
var invalidFeedback = document.querySelector(".feedback");
var APIkey = "a059151d000029215400bdaa7965fbc2"
var latitude = '';
var longitude = '';
console.log(mainText);
var citiesList=[];

function init(){
city.value = JSON.parse(localStorage.getItem(citiesList));
console.log(citiesList);
var listItems = 
`<li class="list-group-item btnStorage">${citiesList}</li>`
$("#cities").append(listItems);
}

function displayTime() {
    var now = moment().format('MMMM Do YYYY, h:mm:ss a');
    timeDisplayEl.text(now);
}

setInterval(displayTime, 1000);
var today = moment().format("dddd");

function getWeather(latitude, longitude) {
    // Insert the API url to get a list of weather data

    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts,minutely,hourly,&units=imperial&appid=a059151d000029215400bdaa7965fbc2`;
    
    fetch(requestUrl)
      .then(async function (response) {
        var data = await response.json();
        printMainContainer(data);
        return;
        //this object contains all the data we requested. 
      })
    } 
     
function printMainContainer(data){
    mainText.textContent = "Happy " + today + "! Here's today's weather in " + city.value + ".";
    fiveDayForecast.textContent="Here's your 5 day forecast!"
  
    var htmlTemplate = 
    `<p>Temp: ${data.current.temp} degrees Fahrenheit.<p>
    <p>Wind Speed: ${data.current.wind_speed} mph.<p>
    <p>Humidity: ${data.current.humidity}.<p>
    <div id="icon"><img id="weatherIcon" src="" alt="Weather icon"></div>`
    $('#currentWeather').append(htmlTemplate);
    var weatherIcon = data.current.weather[0].icon;
   var iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
   $("#weatherIcon").attr("src", iconUrl);

  
    //Add contents into daily cards.
    for (var i = 1; i<6; i++) {
    
     data.daily[i].dt=moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
    var dailyTemplate =
    `<div class="card days individualDays " style="width: 18rem;">
    <div class="card-body ">
      <h5 class="card-title">Date: ${data.daily[i].dt}</h5>
      <p class="card-text">Temp: ${data.daily[i].temp.day} degrees Fahrenheit</p>
      <p class="card-text">Wind speed: ${data.daily[i].wind_speed}  mph</p>
      <p class="card-text">Humidity: ${data.daily[i].humidity}</p>
      <div><img class="dailyWeatherIcon" src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt="Weather icon"></div>
      </div>
    </div>`
  //append string HTML with jQuery
    $('#dailyContainer').append(dailyTemplate);
    }
    
}
function getLatLon(){
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city.value}&appid=a059151d000029215400bdaa7965fbc2`;
    
    fetch(requestUrl)
      .then(async function (response) {
        if(response.ok) {
        const data = await response.json();
      //for (var i = 0; i<data.length; i++) {
            console.log(data)
            latitude = data[0].lat;
            longitude = data[0].lon;
            console.log(longitude);
            console.log(latitude);
            getWeather(latitude,longitude);
            return;
        }
        else{
          invalidFeedback.innerHTML = "Please enter a valid city."
        }
      })
      };

function buttonClickHandler(event){
    event.preventDefault();
    $('#dailyContainer').empty();
    $('#currentWeather').empty();
    citiesList.push(city.value);    
  localStorage.setItem("CityName",JSON.stringify(citiesList));
  console.log(citiesList);
  var listItems = 
`<li class="list-group-item btnStorage">${citiesList}</li>`
$("#cities").append(listItems);

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
init();
