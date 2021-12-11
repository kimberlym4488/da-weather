var timeDisplayEl = $("#time");
var city = document.querySelector("#city");
var mainText = document.querySelector("#mainText");
var invalidFeedback = document.querySelector(".feedback")
console.log(mainText);

function displayTime() {
    var now = moment().format('MMMM Do YYYY, h:mm:ss a');
    timeDisplayEl.text(now);
}

setInterval(displayTime, 1000);
var today = moment().format("dddd");


function getWeather() {
    // Insert the API url to get a list of weather data
   
    var requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=imperial&appid=a059151d000029215400bdaa7965fbc2`;
    
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
        //this object contains all the data we requested. 
      })
      .then(function (data) {
        mainText.textContent = "Happy " + today + "! Here's the weather for " + data.name;
        for (var i = 0; i<data.length; i++) {
            console.log(data[i].name);
          }
          console.log(data);
          //Append the li element to the id associated with the ul element.
        })
      };


function buttonClickHandler(event){
    event.preventDefault();
//If nothing is entered, alert pops up to enter a search term.
        if (city.value==='') {
          invalidFeedback.innerHTML = "Please enter a valid city."
            return;
        } 
        else {
         getWeather(city.value);
        }
}

document.getElementById('btn').addEventListener("click", buttonClickHandler);
  