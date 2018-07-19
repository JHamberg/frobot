const utils = require("../utils");
const guilds = require("../guilds.js");
const request = require("request-promise-native");

const weather = {
    aliases: ["weather", "temperature", "temp"],
    description: "Access the current weather data for a given location",
    enabled: !!process.env.OWM_TOKEN,
    run: async (msg, args, client) => {
        if (!args || args.length < 1) return;
        const output = await msg.channel.send(":hourglass: Loading weather data…");
        const city = args.join(" ").toLowerCase();
        const overwrites = guilds.getLocations(msg.channel.guild);
        const overwrite = overwrites[city];

        // Create the basic query structure 
        const options = {
            url: "https://api.openweathermap.org/data/2.5/weather",
            json: true, 
            qs: {
                units: "metric",
                type: "accurate",
                appid: process.env.OWM_TOKEN
            }
        }

        // Check if the location has been overwritten
        if (overwrite) {
            options.qs.lat = overwrite.latitude;
            options.qs.lon = overwrite.longitude;
        } else {
            options.qs.q = encodeURI(city);
        }

        // Coordinates
        const response = await request(options);
        const status = format(response);

        // TODO: Fix sunrise and sunset daylight savings offset  
        await output.edit([
            `${status.icon} ${status.description} ${status.temp}\n`,
            `:dash: ${status.wind} ${status.direction}\n`,
            `:scales: Pressure: ${status.pressure}\n`,
            `:droplet: Humidity: ${status.humidity}\n`
        ].join(""));
    }
}

// Destructure the somewhat complex json response
const format = (response) => { 
    const weather = response.weather[0];
    const icon = icons[`i${weather.icon}`];
    const {temp, pressure, humidity} = response.main;
    const {sunrise, sunset} = response.sys;

    return {
        icon: utils.emojify(icon),
        description: utils.capitalize(weather.description),
        temp: `${temp} °C`,
        pressure: `${pressure} hPa`,
        humidity: `${humidity}%`,
        wind: `${response.wind.speed} m/s`,
        direction: utils.compassify(response.wind.deg),
        sunrise: utils.clockify(sunrise*1000),
        sunset: utils.clockify(sunset*1000)
    }
}

// Icon to emoji translation table
const icons = {
    i01d: "sunny",
    i02d: "partly_sunny",
    i03d: "cloud",
    i04d: "cloud",
    i09d: "cloud_rain",
    i10d: "white_sun_rain_cloud",
    i11d: "thunder_cloud_rain",
    i13d: "cloud_snow",
    i50d: "foggy",
    i01n: "night_with_stars",
    i02n: "cloud",
    i03n: "cloud",
    i04n: "cloud",
    i09n: "cloud_rain",
    i10n: "cloud_rain",
    i11n: "thunder_cloud_rain",
    i13n: "cloud_snow",
    i50n: "foggy"
}

module.exports = weather;