const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TOKEN)

module.exports = { bot }
