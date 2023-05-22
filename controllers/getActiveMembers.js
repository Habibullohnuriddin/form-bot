const userSchema = require('../models/userSchema')



async function getActiveMembers(ctx) {
  const userId = ctx.message.from.id

  const topUsers = await userSchema.find().sort({ addedUserCount: -1 }).limit(20)

  topUsers.map(user => (
    ctx.replyWithHTML(`${user.username} <strong>${user.addedUserCount}</strong> ta odam qo'shdi`)
  ))
}



// async function getActiveMembers(ctx) {

//   try {
//     // const chatId = ctx.message.chat.id;

//     const topUsers = userSchema.find({ addedUserCount: { $gt: 0 } });
//     console.log(topUsers)
//     topUsers.slice(0, 20);

//     const sortedUsers = topUsers.sort((a, b) => b.invite_count - a.invite_count);


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