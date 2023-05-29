const userSchema = require('../models/userSchema');

async function getActiveMembers(ctx) {

  try {
    const topUsers = await userSchema.find()
      .sort({ addedUserCount: - 1 })
      .limit(20)

    let allUsers = "";
    topUsers.map((user, index) => {
      let name = user.username ? `@${user.username}` : user.firstname
      allUsers += `${index + 1}. ${name} - ${user.addedUserCount}\n`
    })
    ctx.replyWithHTML(allUsers);
  } catch (error) {
    ctx.reply("Siz botga a'zo emassiz")
    console.log(error)
  }

}

module.exports = { getActiveMembers }