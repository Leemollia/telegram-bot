import config from "config";

import { Telegraf, Markup } from "telegraf";
import { message } from "telegraf/filters";

import { Configuration, OpenAIApi } from "openai";


import { getWeatherOnCoords } from "./controllers/WeatherController.js";

const chatGptconfiguration = new Configuration({
    apiKey: config.get("CHAT_GPT_API_TOKEN"),
});
const openai = new OpenAIApi(chatGptconfiguration);
const response = await openai.listModels();
// console.log(response.data.data)

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.start(ctx => ctx.reply('Бусинкам привет'));

bot.on(message('location'), getWeatherOnCoords);

bot.on('message', async (ctx) => {
    try {
        console.log(ctx.message.text)
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ctx.message.text,
            max_tokens: 50, // Control the length of the response
            n: 1, // Generate a single response
            stop: '\n',
          });
          console.log(response.data)
        return ctx.reply(response.data.choices[0].text)
    } catch (error) {
        console.log(error)
        return ctx.reply(error.message);
    }
})

// bot.on('text', async (ctx) => {
//     try {
//       const message = ctx.message.text;
//       const response = await generateResponse(message);
//       ctx.reply(response);
//     } catch (error) {
//       console.error('Error:', error);
//       ctx.reply('Oops! Something went wrong.');
//     }
//   });
  
//   // Generate response using OpenAI
//   async function generateResponse(message) {
//     const prompt = `User: ${message}\nAI:`;
//     const response = await openai.complete({
//       engine: 'davinci', // Choose the OpenAI language model
//       prompt,
//       maxTokens: 50, // Control the length of the response
//       n: 1, // Generate a single response
//       stop: '\n', // Stop generating text at a new line
//     });
  
//     const answer = response.choices[0].text.trim().replace('AI:', '');
//     return answer;
//   }

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