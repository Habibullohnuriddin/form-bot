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
        return await ctx.replyWithHTML('<strong>1. Ismingizni kiriting</strong>', {
          reply_markup: {
            remove_keyboard: true
          }
        });
      case 1:
        user.step = 2;
        user.firstname = text;
        await user.save();
        return ctx.replyWithHTML('<strong>2. Familiyangizni kiriting</strong>');
      case 2:
        user.step = 3
        user.lastname = text;
        await user.save();
        return ctx.replyWithHTML('<strong>3. Yoshingizni kiriting</strong> \n\nMasalan: 18');
      case 3:
        if (isNaN(text)) return ctx.replyWithHTML("⚠️ <strong>Noto'g'ri format.</strong> \n\nIltimos yoshingizni son bilan kiriting!");
        user.step = 4
        user.age = text;
        await user.save();
        return ctx.replyWithHTML('<strong>4. Manzilingizni kiriting</strong> \n\nMasalan: Toshkent shahar Chilonzor tumani Choshtepa MFY №1');
      case 4:
        user.location = text;
        user.step = 5
        await user.save();
        return ctx.replyWithHTML('<strong>5. Telefon raqamingizni kiriting</strong> \n\nMasalan: +998909888954 yoki 909888954');
      case 5:
        if (/^(?:\+998)?[0-9]{9}$/.test(text)) {
          user.phoneNumber = text
          user.step = 6
          await user.save()

          user.phoneNumber = parseInt(ctx.message.text);
          return ctx.replyWithHTML('<strong>6. Bizni qayerdan topdingiz?</strong>', {
            reply_markup: {
              keyboard: whereIsFind_keyboards,
              resize_keyboard: true,
              one_time_keyboard: true,
              remove_keyboard: true
            }
          });
        } else {
          return ctx.replyWithHTML(`<strong>⚠️ Iltimos telefon raqamingizni quyidagi formatda  kiriting!</strong> \n\n+998909888954 yoki 909888954`);
        }

      case 6:
        user.whereIsFind = text
        user.step = 7
        await user.save()

        return ctx.replyWithHTML('<strong>7. Kompyuteringiz bormi?</strong>', {
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

        return ctx.replyWithHTML('<strong>8. Kompyuteringiz internetga ulanganmi?</strong>', {
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

        return ctx.replyWithHTML('<strong>9. Kompyuteringizda <u>Word</u>, <u>Exel</u> va <u>Telegram</u> bormi?</strong>', {
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
          `<em>• Yangi o‘quvchining anketasi</em>\n
1. Username: <strong>@${user.username}</strong>
2. Ismi: <strong>${user.firstname}</strong>
3. Familiyasi: <strong>${user.lastname}</strong>
4. Yoshi: <strong>${user.age}</strong>
5. Manzili: <strong>${user.location}</strong>
6. Nomeri: <strong>${user.phoneNumber}</strong>
7. Qayerdan topgani: <strong>${user.whereIsFind}</strong>
8. Kompyuteri bormi: <strong>${user.hasComputer}</strong>
9. Internetga ulanganmi: <strong>${user.hasInternet}</strong>
10. Dasturlar bormi: <strong>${user.hasSoftware}</strong>
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