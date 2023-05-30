const { messages } = require('../lib/messages');
const userSchema = require('../models/userSchema');

async function getActiveMembers(ctx) {

  try {
    const topUsers = await userSchema.find()
      .sort({ addedUserCount: - 1 })
      .limit(20)

    let allUsers = `${messages['/top']}\n\n`;

    topUsers.map((user, index) => {
      let name = user.username ? `@${user.username}` : user.firstname
      allUsers += `${index + 1}. ${name} - ${user.addedUserCount}\n`
    })
    ctx.replyWithHTML(allUsers);

  } catch (error) {
    ctx.reply(messages['error'])
    console.log(error)

  }

}

module.exports = { getActiveMembers }