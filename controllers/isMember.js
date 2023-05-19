const { bot } = require('../core/bot');

async function isMember(channelId, userId) {
  try {
    let res = await bot.telegram.getChatMember(channelId, userId);
    return res.status === "administrator" || res.status === "creator" || res.status === "member";
  } catch (error) {
    return false;
  }
}

const channelUsernames = ['@Kompyuter_Kursi15KUN', '@Kompyuter_kursi15'];

async function isMemberInAll(ctx) {
  const userId = ctx.from.id;
  let ch1 = await isMember(channelUsernames[0], userId);
  let ch2 = await isMember(channelUsernames[1], userId);
  // let ch3 = await isMember(channelUsernames[2], userId);
  return ch1 && ch2;
}

module.exports = { isMember, isMemberInAll }
