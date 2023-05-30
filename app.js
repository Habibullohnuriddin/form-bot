require("mongoose")
require('./controllers')
require('./core')

const { default: mongoose } = require('mongoose');
const cors = require('cors')
const express = require('express');
const app = express();

require('dotenv').config()


const uri = process.env.MONGO_URI
module.exports = { uri }

app.use(express.json());
app.use(cors());

mongoose
  .connect(uri, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
  .then(() => {
    app.listen(() => {
      console.log(`✅ MongoDB-ga ulanish muvaffaqiyatli amalga oshirildi!`);
    });
  })
  .catch((err) => {
    console.log('⚠️ MongoDBga ulanishda xatolik:', err);
  });
