const inline_keyboards = [
  [{ text: "Kompyuter Kursi | 15 KUN", url: "https://t.me/Kompyuter_Kursi15KUN" }],
  [{ text: "Online | Kompyuter Kursi", url: "https://t.me/Kompyuter_kursi15" }],
  [{ text: "Online | Kompyuter Kursi", url: "https://t.me/Online_Kompyuter15" }],
  [{ text: "Tasdiqlash", callback_data: "check" }],
  [{ text: `${user.first_name}`, url: `tg://user?id=${user.userID}` }],
]

const whereIsFind_keyboards = [
  [{ text: 'Telegram' }, { text: 'Instagram' }],
  [{ text: 'Facebook' }, { text: 'Tanishimdan' }],
]

const question_keyboards = [
  [{ text: 'ha' }, { text: "yo'q" }]
]

const hasInternet_keyboards = [
  [{ text: 'Internetga ulangan' }, { text: 'WiFi tarqata olaman' }],
]

module.exports = { inline_keyboards, whereIsFind_keyboards, question_keyboards, hasInternet_keyboards }
