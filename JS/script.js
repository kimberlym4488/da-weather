//Variable List
var timeDisplayEl = $("#time");
var mainText = document.querySelector("#mainText");
var fiveDayForecast=document.querySelector("#fiveDayForecast")
var invalidFeedback = document.querySelector(".feedback");
var APIkey = "a059151d000029215400bdaa7965fbc2"
var latitude = '';
var longitude = '';
var citiesList=[];
var cityName=""

//Displays the time and date in the top right hand corner
function displayTime() {
    var now = moment().format('MMMM Do YYYY, h:mm:ss a');
    timeDisplayEl.text(now);
}

//Displays the current day!
setInterval(displayTime, 1000);
var today = moment().format("dddd");

$(document).ready(function () {

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
   
    fiveDayForecast.textContent="Here's your 5 day forecast!"
    $('#dailyContainer').empty();
    $('#currentWeather').empty();
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
    var dailyTemplate =
    `<div class="col-12 col-sm-5 col-md-3 col-lg col-xl days individualDays ">
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
function searchOpenWeather(city){
console.log(city)
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=a059151d000029215400bdaa7965fbc2`;

    fetch(requestUrl)
    .then(async function (response) {
      var data = await response.json();

    //prevents dup cities and add this city.
    if (browserHistory.indexOf(city) === -1) {
      browserHistory.push(city);
      window.localStorage.setItem("history", JSON.stringify(browserHistory));
  } 
  
    //create variables for each item we'll need to populate our html   
        latitude = data[0].lat;
        longitude = data[0].lon;
        cityName=data[0].name;
        mainText.textContent = "Happy " + today + "! Here's today's weather in " + cityName + ".";
        //got to the next step, convert the city name to lat and lon.
        getWeather(latitude,longitude);
    })
}  
      
 // store search history, only want to store 5
let browserHistory = JSON.parse(window.localStorage.getItem("history")) || [];
    for (let i = 0; i < 5; i++) {
        createButton(browserHistory[i]);
        //the button name will be the city name from the array
    }

   //if you click search 
$("#searchBtn").on("click", function (event) {
 event.preventDefault();
  console.log("you clicked the main search button")
  var city=($("#searchCity").val());
  console.log("you pressed search and " + city + " is what you typed ");
  $("#searchCity").hide();
  $(".searchAgain").show();
  searchOpenWeather(city);
});

// creates a new row for each city in the search history. Should only be five total, per our for loop above.
function createButton(city) {
      let newButton = $("<button>").addClass("btn citybtn").text(city);
      newButton.val(city);
      $("#cityList").append(newButton);
}

//if you click a city in the recent searches section, it should also send you to the starter function to convert city to Lat/Lon
$(document).on("click", ".citybtn", function (event) {
  event.preventDefault();
  console.log("You clicked the citybtn")
  searchOpenWeather($(this).val());
});

$(document).on("click", ".clearList", function (event) {
  event.preventDefault();
  console.log("You clicked the citybtn")
  $("#cityList").empty();
  localStorage.clear();
  document.location.reload();
})

$("#searchAgain").on("click", function (){
  $("#searchCity").show();
})
//event listener for clicking the search button
/*$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  console.log("you clicked the main search button")
  var weatherCity=($("#searchCity").val());
  console.log("you pressed search and " + weatherCity + " is what you typed ");
  searchOpenWeather(weatherCity);
});*/

});


   //if you click search 

  
// Clicking on a button in the search history sidebar
// will populate the dashboard with info on that city.

      //need to improve this local storage functionality.
/*function buttonClickHandler(event){
  event.preventDefault();
    $('#dailyContainer').empty();
    $('#currentWeather').empty();
   
    //I push the city.value into the citiesList array.
    //Next, I set that into the citiesList local storage 

//If nothing is entered, alert pops up to enter a search term.
        if (city.value==='') {
          invalidFeedback.innerHTML = "Please enter a valid city."
            return;
        } 
        else {
            getLatLon(city.value);
        }
}*/
//Displays on page load - event listener for the search button, and init() function runs to view and update local storage. 

