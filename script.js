document.getElementById("searchBtn").addEventListener("click", function () {
    let city = document.getElementById("cityInput").value;

    if (city === "") {
        alert("Please enter city name");
        return;
    }

    getWeather(city);
});


async function getWeather(city) {

    try {
        let locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

        let locationResponse = await fetch(locationUrl);
        let locationData = await locationResponse.json();

        if (!locationData.results) {
            alert("City not found");
            return;
        }

        let latitude = locationData.results[0].latitude;
        let longitude = locationData.results[0].longitude;
        let cityName = locationData.results[0].name;
        let country = locationData.results[0].country;

        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=5&timezone=auto`;

        let weatherResponse = await fetch(weatherUrl);
        let weatherData = await weatherResponse.json();

        let current = weatherData.current;

        document.getElementById("cityName").innerText = cityName + ", " + country;
        document.getElementById("temperature").innerText = current.temperature_2m + "°C";
        document.getElementById("feelsLike").innerText = "Feels Like " + current.apparent_temperature + "°C";
        document.getElementById("humidity").innerText = current.relative_humidity_2m + "%";
        document.getElementById("wind").innerText = current.wind_speed_10m + " km/h";
        
        let condition = "Clear";

        if (current.weather_code === 0) {
            condition = "Clear Sky";
        } else if (current.weather_code <= 3) {
            condition = "Partly Cloudy";
        } else if (current.weather_code <= 48) {
            condition = "Foggy";
        } else if (current.weather_code <= 67) {
            condition = "Rainy";
        } else if (current.weather_code <= 77) {
            condition = "Snowy";
        } else if (current.weather_code <= 82) {
            condition = "Rain Showers";
        } else if (current.weather_code >= 95) {
            condition = "Thunderstorm";
        }

        document.getElementById("condition").innerText = condition;

        document.getElementById("uv").innerText =
            weatherData.daily.uv_index_max[0];

        let hourly = weatherData.hourly;
        let index = hourly.time.indexOf(current.time);

        if (index === -1) {
            index = 0;
        }

        document.getElementById("visibility").innerText =
            (hourly.visibility[index] / 1000).toFixed(1) + " km";

        let forecast = weatherData.daily;
        let output = "";

        for (let i = 0; i < forecast.time.length; i++) {

            let day = new Date(forecast.time[i])
                .toLocaleDateString("en-US", { weekday: "long" });

            output += `
                <div class="forecast-card">
                    <p>${day}</p>
                    <h2>${getWeatherIcon(forecast.weather_code[i])}</h2>
                    <h3>${forecast.temperature_2m_max[i]}°C</h3>
                    <p>${forecast.temperature_2m_min[i]}°C</p>
                </div>
            `;
        }

        document.querySelector(".forecast-container").innerHTML = output;

    } catch (error) {
        alert("Something went wrong. Please try again.");
        console.log(error);
    }
}


function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    } else if (code <= 3) {
        return "🌤️";
    } else if (code <= 48) {
        return "🌫️";
    } else if (code <= 67) {
        return "🌧️";
    } else if (code <= 77) {
        return "❄️";
    } else if (code <= 82) {
        return "🌦️";
    } else if (code >= 95) {
        return "⛈️";
    }

    return "☁️";
}


getWeather("Meerut");
