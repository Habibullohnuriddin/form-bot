require('dotenv').config()
require("mongoose")
require('./controllers')
require('./core')

const mongoose = require('mongoose');
const cors = require('cors')
const express = require('express');
const app = express();

const uri = process.env.MONGO_URI

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
