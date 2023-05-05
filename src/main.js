import { Telegraf, Markup } from "telegraf";
import { message } from "telegraf/filters";

import config from "config";

import { getWeatherOnCoords } from "./controllers/WeatherController.js";

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.start(ctx => ctx.reply('Бусинкам привет'));

bot.on(message('location'), getWeatherOnCoords);

bot.command('weather', ctx => {
    return ctx.reply(
        'Для отправки погоды нам нужна твоя геопозиция',
        Markup.keyboard([
            Markup.button.locationRequest('Отправить геопозицию'),
            Markup.button.text('Отправить геопозицию'),
            Markup.button.switchToCurrentChat('1', '2')
        ]).resize()
    )
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));