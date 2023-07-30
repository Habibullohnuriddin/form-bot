require('dotenv').config()
require("mongoose")
require('./controllers')
require('./core')

const mongoose = require('mongoose');
const cors = require('cors')
const express = require('express');
const app = express();

// const uri = process.env.MONGO_URI

app.use(express.json());
app.use(cors());

try {
  await mongoose.connect('mongodb+srv://nuriddin_off:ju_YC3Y6fA6gsY7@cluster0.jcihehj.mongodb.net/userform?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
  });
  app.listen(() => {
    console.log(`✅ MongoDB-ga ulanish muvaffaqiyatli amalga oshirildi!`);
  });
} catch (err) {
  console.log('⚠️ MongoDBga ulanishda xatolik:', err);
}
