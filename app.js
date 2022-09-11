const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const swal = require("sweetalert");

let chunks = [];




var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", function(req, res) {
  res.render("index");
})

app.get("/showWeather", function(req, res) {
  res.render("showWeather");
})

app.get("/subscribe", function(req, res) {
  res.render("subscribe")
})

app.get("/subscribed", function(req, res) {
  res.render("subscribed");
})

app.get("/hourly", function(req, res) {
  // url="http://api.openweathermap.org/geo/1.0/direct?q="+cityname+"&limit=1&appid=0037c2c2b6d8ec8cdfe0c1d6ddf12537"

});
app.post("/subscribed", function(req, res) {
  const city = req.body.cityname;
  const phoneNumber = req.body.phoneNumber;
  const alertType = req.body.alertType;
  if (city.length === 0 || phoneNumber.length === 0 || alertType.length === 0) {
    res.render("subscribe");
  } else {
    res.render("subscribed", {
      cityname: city,
      phoneNumber: phoneNumber,
      alertType: alertType
    })
  }

})

app.post("/", function(req, res) {

  const cityname = req.body.cityname;
  const time = req.body.time;
  // var timeWords = document.querySelector["form"][1][time+1].innerHTML
  // console.log(timeWords);
  console.log(cityname);
  console.log(time);
  if (cityname.length === 0) {
    res.render("index");

  }
  else {
    var lat = 0;
    var lon = 0;
    console.log(cityname);
    // getting latititude and longitude from api
    latlongUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityname + "&limit=1&appid=0037c2c2b6d8ec8cdfe0c1d6ddf12537"
    console.log("lat "+latlongUrl);

    https.get(latlongUrl, function(response) {
      response.on("data", function(data) {
        var latongData = JSON.parse(data);
        lat = latongData[0]["lat"];
        lon = latongData[0]["lon"];

        // getting weather icons and description from openwearther
        url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=0037c2c2b6d8ec8cdfe0c1d6ddf12537&units=imperial";
        console.log("url "+url);
        https.get(url, function(response) {
          data="";
          chunks=[];
          response.on('data', function(data) {
            chunks.push(data);
          }).on('end', function() {
            console.log(url);
            let data = Buffer.concat(chunks);
            let schema = JSON.parse(data);

            var weatherDescription = schema["list"][time]["weather"][0]["description"];
            var weatherIcon = schema["list"][time]["weather"][0]["icon"];
            var temp = schema["list"][time]["main"]["temp"];
            var icon = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
            var weatherDesc = "The weather will be " + weatherDescription
            var weatherIcon = icon
            var dateText = schema["list"][time]["dt_txt"]
            var weatherTemp = "The temperature in " + cityname + " will be " + temp + "celsius"
            res.render("showWeather", {
              weatherDecription: weatherDesc,
              weatherIcon: weatherIcon,
              weatherTempearure: weatherTemp,
              time: time,
              dateText: dateText

            })

          });
        })
      })
    })

  }

})

app.listen(process.env.PORT || 3000, console.log("Server is running at port 3000........"));
