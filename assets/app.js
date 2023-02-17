var historySearch = [];

function itemGet() {
  var storedCities = JSON.parse(localStorage.getItem("historySearch"));
  if (storedCities !== null) {
    historySearch = storedCities;
    localStorage.clear();
  }
  for (i = 0; i < historySearch.length; i++) {
    if (i == 8) {
      break;
    }
    buttonlistCities = $("<a>").attr({
      class: "list-group-item",
      href: "#",
    });

    buttonlistCities.text(historySearch[i]);
    $(".group-list").append(buttonlistCities);
  }
}
var city;
var cardMain = $(".card-body");

itemGet();

function dataGet() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=dd82af61979bdfae66b29bb8d2775093";
  cardMain.empty();
  $("#ForecastWeekly").empty();

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var date = moment().format(" MM/DD/YYYY");
    var codeIcon = response.weather[0].icon;
    var URLIcone = "http://openweathermap.org/img/w/" + codeIcon + ".png";
    var name = $("<h3>").html(city + date);
    cardMain.prepend(name);
    cardMain.append($("<img>").attr("src", URLIcone));
    var temp = Math.round((response.main.temp - 273.15) * 1.8 + 32);
    cardMain.append($("<p>").html("Temperature: " + temp + " &#8457"));
    var humidity = response.main.humidity;
    cardMain.append($("<p>").html("Humidity: " + humidity));
    var windSpeed = response.wind.speed;
    cardMain.append($("<p>").html("Wind Speed: " + windSpeed));
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi?appid=dd82af61979bdfae66b29bb8d2775093&lat=" +
        lat +
        "&lon=" +
        lon,
      method: "GET",
    }).then(function (response) {
      cardMain.append(
        $("<p>").html("UV Index: <span>" + response.value + "</span>")
      );

      if (response.value <= 2) {
        $("span").attr("class", "btn btn-outline-success");
      }
      if (response.value > 2 && response.value <= 5) {
        $("span").attr("class", "btn btn-outline-warning");
      }
      if (response.value > 5) {
        $("span").attr("class", "btn btn-outline-danger");
      }
    });

    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=dd82af61979bdfae66b29bb8d2775093",
      method: "GET",
    }).then(function (response) {
      for (i = 0; i < 5; i++) {
        var newCard = $("<div>").attr(
          "class",
          "col fiveDay bg-primary text-white rounded-lg p-2"
        );
        $("#ForecastWeekly").append(newCard);
        var myDate = new Date(response.list[i * 8].dt * 1000);
        newCard.append($("<h4>").html(myDate.toLocaleDateString()));
        var codeIcon = response.list[i * 8].weather[0].icon;
        var URLIcone = "http://openweathermap.org/img/w/" + codeIcon + ".png";
        newCard.append($("<img>").attr("src", URLIcone));
        var temp = Math.round(
          (response.list[i * 8].main.temp - 273.15) * 1.8 + 32
        );

        newCard.append($("<p>").html("Temp: " + temp + " &#8457"));

        var humidity = response.list[i * 8].main.humidity;

        newCard.append($("<p>").html("Humidity: " + humidity));
      }
    });
  });
}

$("#searchCity").click(function () {
  city = $("#city").val();
  dataGet();
  var AryCheck = historySearch.includes(city);
  if (AryCheck == true) {
    return;
  } else {
    historySearch.push(city);
    localStorage.setItem("historySearch", JSON.stringify(historySearch));
    var buttonlistCities = $("<a>").attr({
      class: "list-group-item",
      href: "#",
    });
    buttonlistCities.text(city);
    $(".group-list").append(buttonlistCities);
  }
});

$(".list-group-item").click(function () {
  city = $(this).text();
  dataGet();
});
