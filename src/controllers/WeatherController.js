import config from "config";
import axios from "axios";

import { bold } from 'telegraf/format'

export const getWeatherOnCoords = async (ctx) => {
    console.log(ctx.message.location);
    if (!ctx.message.location) return;

    const latitude = ctx.message.location.latitude;
    const longitude = ctx.message.location.longitude;

    try {
        const data = await axios({
            method: 'get',
            url: `https://api.weather.yandex.ru/v2/informers?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&lang=ru_RU`,
            headers: {
                'X-Yandex-API-Key': config.get('YANDEX_WEATHER_API_TOKEN')
            }
        });

        console.log('data', data.data);
        return ctx.replyWithHTML(returnedData(data.data));
    } catch (error) {
        console.log('error', error);
        return ctx.reply('Произошла ошибка, повторите позже');
    }

    function returnedData(data) {
        if (!data) return;
        const fact = data.fact;

        return `На улице сейчас <b>${translateWeatherCondition(fact.condition)}</b>, <b>${fact.temp}°C</b>, риал фил в раёне <b>${fact.feels_like}°C</b>`;
    }

    function translateWeatherCondition(condition) {
        if (!condition) return;
        const values = {
            'clear': 'ясно',
            'partly-cloudy': 'малооблачно',
            'cloudy': 'облачно с прояснениями',
            'overcast': 'пасмурно',
            'drizzle': 'морось',
            'light-rain': 'небольшой дождь',
            'rain': 'дождь',
            'moderate-rain': 'умеренно сильный дождь',
            'heavy-rain': 'сильный дождь',
            'continuous-heavy-rain': 'длительный сильный дождь',
            'showers': 'ливень',
            'wet-snow': 'дождь со снегом',
            'light-snow': 'небольшой снег',
            'snow': 'снег',
            'snow-showers': 'снегопад',
            'hail': 'град',
            'thunderstorm': 'гроза',
            'thunderstorm-with-rain': 'дождь с грозой',
            'thunderstorm-with-hail': 'гроза с градом',
        }

        return values[condition];
    }
}