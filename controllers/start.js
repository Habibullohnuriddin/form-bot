const { bot } = require('../core/bot')
const { messages } = require('../lib/messages')
const { inline_keyboards } = require('../lib/keyboards')
const userSchema = require('../models/userSchema')
const { isMemberInAll } = require('./isMember')
const { hasAccount, hasFullInfo, stepSwitcher } = require('./hasAccount')
const UserModel = require("../models/userSchema");
const { getActiveMembers } = require('./getActiveMembers')


bot.start(async (ctx) => {
  const chat = ctx.chat.type;
  const user_id = ctx.message.from.id;
  const user = await UserModel.findOne({ id: user_id });

  if (chat === 'private') {
    if (user) {
      user.step = 0;
      await user.save();
    } else {
      const newUser = new UserModel({
        id: user_id
      })
      await newUser.save();
    }

    await ctx.replyWithHTML(messages['start'], {
      reply_markup: {
        inline_keyboard: inline_keyboards
      }
    })
  }
})

bot.command('top', async (ctx) => {
  getActiveMembers(ctx)
})

bot.on('callback_query', async (ctx) => {

  ctx.answerCbQuery().catch(err => { }); //post button bosilganda zagruzkani oldini va errorni oldini oladi
  ctx.deleteMessage().catch(err => { }); //ozidan oldingi msgni ochiradi

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
})

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

bot.on('new_chat_members', async (ctx) => {
  const from = ctx.message.from;
  let currentUser = await UserModel.findOne({ id: from.id });

  if (currentUser) {
    currentUser.addedUserCount += 1;
    await currentUser.save();
  } else {
    // currentUser null, shuning uchun yangi obyektni yaratamiz
    currentUser = new UserModel({
      id: from.id,
      addedUserCount: 1,
      username: ctx.from.username,
      firstname: ctx.from.first_name,
    });
    await currentUser.save();
  }
})

bot.launch()
