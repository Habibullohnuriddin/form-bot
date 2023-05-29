const { whereIsFind_keyboards, question_keyboards, hasInternet_keyboards } = require("../lib/keyboards");
const UserModel = require("../models/userSchema");

async function hasFullInfo(userId) {
  const user = await UserModel.findOne({ id: userId });
  return user?.isFulledInfo;
}

async function hasAccount(userId) {
  const user = await UserModel.findOne({ id: userId });
  return Boolean(user);
}

const stepSwitcher = async (user, ctx) => {
  const chat = ctx.chat.type;

  if (chat === 'private') {

    let text = ctx.message?.text;
    switch (user.step) {
      case 0:
        user.step = 1;
        await user.save();
        return await ctx.reply('Ismingizni kiriting:');
      case 1:
        user.step = 2;
        user.firstname = text;
        await user.save();
        return ctx.reply('Familiyangizni kiriting:');
      case 2:
        user.step = 3
        user.lastname = text;
        await user.save();
        return ctx.reply('Yoshingizni kiriting:');
      case 3:
        if (isNaN(text)) return ctx.reply("Notogri format");
        user.step = 4
        user.age = text;
        await user.save();
        return ctx.replyWithHTML('<b>Manzilingizni kiriting:</b> \n\nMisol: <b>Toshkent shahar Chilonzor tumani Choshtepa MFY №1</b>');
      case 4:
        user.location = text;
        user.step = 5
        await user.save();
        return ctx.replyWithHTML('Telefon raqamingizni kiriting? \n\nMisol: <b>+998909888954</b>');
      case 5:
        if (/^[+0-9()\- ]+$/.test(text)) {
          user.phoneNumber = text
          user.step = 6
          await user.save()

          user.phoneNumber = parseInt(ctx.message.text);
          console.log(user);
          return ctx.reply('Bizni qayerdan topdingiz?', {
            reply_markup: {
              keyboard: whereIsFind_keyboards,
              resize_keyboard: true,
              one_time_keyboard: true,
              remove_keyboard: true
            }
          });
        } else {
          return ctx.reply(`⚠️ Iltimos telefon raqamingizni to'g'ri formatda  kiriting?`);
        }

      case 6:
        user.whereIsFind = text
        user.step = 7
        await user.save()

        return ctx.reply('Kompyuteringiz bormi?', {
          reply_markup: {
            keyboard: question_keyboards,
            resize_keyboard: true,
            one_time_keyboard: true,
            remove_keyboard: true,
          }
        });

      case 7:
        user.hasComputer = text
        user.step = 8
        await user.save()

        return ctx.reply('Kompyuteringiz internetga ulanganmi?', {
          reply_markup: {
            keyboard: hasInternet_keyboards,
            resize_keyboard: true,
            one_time_keyboard: true,
            remove_keyboard: true,
          }
        });

      case 8:
        user.hasInternet = text
        user.step = 9
        await user.save()

        return ctx.replyWithHTML('Kompyuteringizda <b>Word</b>, <b>Exel</b> va <b>Telegram</b> bormi?', {
          reply_markup: {
            keyboard: question_keyboards,
            resize_keyboard: true,
            one_time_keyboard: true,
            remove_keyboard: true,
          }
        });

      case 9:
        user.hasSoftware = text
        user.step = 10
        user.isFulledInfo = true;
        await user.save();
        ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID,
          `<em>• Yangi foydalanuvchining ma'lumotlari</em>\n
      Username: <strong>@${user.username}</strong>
      Ismi: <strong>${user.firstname}</strong>
      Familiyasi: <strong>${user.lastname}</strong>
      Yoshi: <strong>${user.age}</strong>
      Manzili: <strong>${user.location}</strong>
      Nomeri: <strong>${user.phoneNumber}</strong>
      Qayerdan topgani: <strong>${user.whereIsFind}</strong>
      Kompyuteri bormi: <strong>${user.hasComputer}</strong>
      Internetga ulanganmi: <strong>${user.hasInternet}</strong>
      Dasturlar bormi: <strong>${user.hasSoftware}</strong>
                `, { parse_mode: 'HTML' })

        ctx.reply(`Vaqt ajratganingiz uchun rahmat! Siz bilan albatta bog'lanamiz! 😊`, {
          reply_markup: {
            remove_keyboard: true
          }
        });
    }
  }
}

module.exports = { hasAccount, hasFullInfo, stepSwitcher };