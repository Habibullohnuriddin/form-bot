const { bot } = require('../core/bot')
const { messages } = require('../lib/messages')
const { inline_keyboards } = require('../lib/keyboards')
const userSchema = require('../models/userSchema')
const { isMemberInAll } = require('./isMember')
const { hasAccount, hasFullInfo, stepSwitcher } = require('./hasAccount')
const UserModel = require("../models/userSchema");

bot.start(async (ctx) => {
  try {
    const chat = ctx.chat.type;
    const user_id = ctx.message.from.id;
    let username = ctx.message.from.username;

    if (chat === 'private') {
      let user = await UserModel.findOne({ id: user_id });

      if (user) {
        user.step = 0;
        user.username = username || `tg://user?id=${user.userID}`; // Username-ni yangilash yoki yangi link qo'yish
        await user.save();
      } else {
        username = username || `tg://user?id=${user.userID}`; // Agar username bo'lmasa, yangi link qo'yish
        const newUser = new UserModel({ id: user_id, username });
        await newUser.save();
      }

      await ctx.replyWithHTML(messages['start'], {
        reply_markup: {
          inline_keyboard: inline_keyboards,
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on('callback_query', async (ctx) => {
  try {
    ctx.answerCbQuery(); //post button bosilganda zagruzkani oldini va errorni oldini oladi
    ctx.deleteMessage(); //ozidan oldingi msgni ochiradi

    const bool_info = await hasFullInfo(ctx.from.id);
    let isMember = await isMemberInAll(ctx);

    if (isMember === true) {
      if (bool_info) {
        await ctx.reply(`⚠️ Siz avval ro'yxatdan o'tgansiz`);
      }
      else {
        const isExist = await hasAccount(ctx.from.id);
        if (!isExist) await userSchema.create({ id: ctx.from.id, username: ctx.from.username, step: 0 });
        await ctx.replyWithHTML(messages['true'])
        await ctx.replyWithHTML(messages['info']);
        const current_user = await userSchema.findOne({ id: ctx.from.id });
        await stepSwitcher(current_user, ctx);
      }
    }
    else {
      ctx.reply(messages["false"])
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on('text', async (ctx) => {
  const username = ctx.from.username;
  const user_id = ctx.from.id;
  const chat = ctx.chat.type;

  const hasFullInfos = await hasFullInfo(ctx.from.id);

  if (await isMemberInAll(ctx)) {
    if (hasFullInfos && chat === 'private') {
      await ctx.reply(`Siz bilan tez orada bog'lanamiz 😊`);
    }
    else {
      const current_user = await userSchema.findOne({ id: user_id });
      const isFulled = current_user?.isFulledInfo;
      if (isFulled && chat === 'private') return ctx.reply("Malumot to'liq");
      await stepSwitcher(current_user, ctx);
    }
  }
  else {
    ctx.replyWithHTML(`⚠️ <strong>Assalomu alaykum!</strong>, <em>@${username}</em>\n
Iltimos, avval quyidagi kanallarga ulanishingizni so'raymiz:
@${'Kompyuter_kursi15'}
@${'Kompyuter_Kursi15KUN'}`);
  }
});

bot.launch()
