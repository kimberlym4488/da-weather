//Variable List
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
var dailyHumidity="";

function init(){
city.value = JSON.parse(localStorage.getItem(citiesList));
console.log(citiesList);
var listItems = 
`<li class="list-group-item btnStorage">${citiesList}</li>`
$("#cities").append(listItems);
}

//Displays the time and date in the top right hand corner
function displayTime() {
    var now = moment().format('MMMM Do YYYY, h:mm:ss a');
    timeDisplayEl.text(now);
}

//Displays the current day!
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
 //Adds content into the current weather card    
function printMainContainer(data){
    mainText.textContent = "Happy " + today + "! Here's today's weather in " + city.value + ".";
    fiveDayForecast.textContent="Here's your 5 day forecast!"
  
    var htmlTemplate = 
    `<p>Temp: ${data.current.temp} degrees Fahrenheit.<p>
    <p>Wind Speed: ${data.current.wind_speed} mph.<p>
    <p class="humidity">Humidity: ${data.current.humidity}%.</p>
    <p class="uvi">UV Index: ${data.current.uvi}.</p>
    <div id="icon"><img id="weatherIcon" src="" alt="Weather icon"></div>`
    $('#currentWeather').append(htmlTemplate);
    var weatherIcon = data.current.weather[0].icon;
   var iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
   $("#weatherIcon").attr("src", iconUrl);


if (data.current.uvi> 6){
  document.querySelector(".uvi").style.background="red";
  document.querySelector(".uvi").style.color="white";
 }
else if(data.current.uvi <5.9 & data.current.humidity>3 ){
  document.querySelector(".uvi").style.background="yellow";
  document.querySelector(".uvi").style.color="black";
}

else if (data.current.uvi <2.9 ){
  document.querySelector(".uvi").style.background="green";
  document.querySelector(".uvi").style.color="white";
}
else {
  document.querySelector(".uvi").style.background="white"
  document.querySelector(".uvi").style.color="black";
}
    
    //Add contents into 5 day cards
    for (var i = 1; i<6; i++) {
    data.daily[i].dt=moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
    var dailyTemplate=
    `<div class="col-12 col-sm-4 col-md-3 col-lg col-xl days individualDays">
    <div class="card-body ">
      <p class="card-title">Date: ${data.daily[i].dt}<p>
      <p class="card-text">Temp: ${data.daily[i].temp.day} degrees F</p>
      <p class="card-text">Wind: ${data.daily[i].wind_speed}  mph</p>
      <p class="card-text dailyHumidity">Humidity: ${data.daily[i].humidity}</p>
      <div><img class="dailyWeatherIcon" src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt="Weather icon"></div>
      </div>
    </div>`
  //append string HTML with jQuery
    $('#dailyContainer').append(dailyTemplate);
    }
  }   


  

//Get the latitude and longitude when a city name is entered.
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

      //need to improve this local storage functionality.
function buttonClickHandler(event){
    event.preventDefault();
    $('#dailyContainer').empty();
    $('#currentWeather').empty();
    citiesList.push(city.value);    
  localStorage.setItem("CityName",JSON.stringify(citiesList));
  console.log(citiesList);
  var listItems = 
`<li class="list-group-item citiesList btnStorage">${citiesList}</li>`
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

//Displays on page load - event listener for the search button, and init() function runs to view and update local storage. 
document.getElementById('btn').addEventListener("click", buttonClickHandler);
init();
