const utils = require("../utils");
const request = require("request-promise-native");

const weather = {
    aliases: ["weather", "temperature", "temp"],
    description: "Access the current weather data for a given location",
    enabled: !!process.env.OWM_TOKEN,
    run: async (msg, args, client) => {
        if(!args || args.length < 2) return;
        const [latitude, longitude] = args;
        const options = {
            url: "https://api.openweathermap.org/data/2.5/weather",
            json: true, 
            qs: {
                lat: latitude,
                lon: longitude,
                units: "metric",
                type: "accurate",
                appid: process.env.OWM_TOKEN
            }
        }
        const response = await request(options);
        const status = format(response);

        // TODO: Fix sunrise and sunset daylight savings offset  
        await msg.channel.send([
            `${status.icon} ${status.description} ${status.temp}\n`,
            `:dash: ${status.wind} ${status.direction}\n`,
            `:scales: Pressure: ${status.pressure}\n`,
            `:droplet: Humidity: ${status.humidity}\n`
        ].join(""));
    }
}

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

const icons = {
    i01d: "sunny",
    i02d: "partly_sunny",
    i03d: "cloud",
    i04d: "cloud",
    i09d: "cloud_rain",
    i10d: "white_sun_rain_cloud",
    i11d: "thunder_cloud_rain",
    i13d: "cloud_snow",
    i50d: "foggy"
}

module.exports = weather;