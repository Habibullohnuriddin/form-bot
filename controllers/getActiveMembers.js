const userSchema = require('../models/userSchema')

async function getActiveMembers(ctx) {

  // Top 20 foydalanuvchini topish
  const topUsers = await userSchema.find()
    .sort({ addedUserCount: -1 })
    .limit(20)

  // ... Natijani console.log qiling yoki javob yuboring
  const results = topUsers.map(user => (
    `
    @${user.username} ${user.addedUserCount}
    `
  ))
  console.log(results.join('\n'))
}


// async function getActiveMembers(ctx) {

//   try {
//     // const chatId = ctx.message.chat.id;

//     const topUsers = userSchema.find({ addedUserCount: { $gt: 0 } });

//     topUsers.slice(0, 20);

//     // Foydalanuvchilarni odamlarni qo'shish bo'yicha saralash
//     const sortedUsers = topUsers.sort((a, b) => b.invite_count - a.invite_count);

//     // Eng ko'p odam qoshgan 20 ta userni olish

//     // Natijani formatlash va yuborish
//     let response = '🔝 Eng ko\'p odam qoshgan 20 ta user:\n\n';

//     sortedUsers.forEach((user, index) => {
//       response += `${index + 1}. ${user.user.first_name} (@${user.user.username}): ${user.invite_count}\n`;
//     });
//     ctx.reply(response);
//     console.log(response)

//   } catch (error) {
//     console.error(error);
//     ctx.reply('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
//   }
// }



module.exports = { getActiveMembers }